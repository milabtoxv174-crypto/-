import { RSVPResponse } from '../types';
import { WEDDING_CONFIG } from '../config/weddingConfig';

export const GOOGLE_SHEETS_STORAGE_KEY = 'petr_viktoria_google_sheets_url';

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Если таблица пустая, автоматически создаем красивые золотые заголовки
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Дата и время",
        "Имя гостя",
        "Статус присутствия",
        "Напитки",
        "Трансфер (от ЗАГСа до Высокого)",
        "Пожелание / Примечание"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#c5a059");
      headerRange.setFontColor("#051a14");
      sheet.setFrozenRows(1);
    }
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var now = Utilities.formatDate(new Date(), "GMT+3", "dd.MM.yyyy HH:mm:ss");
    
    var attendanceText = "С удовольствием приду";
    if (data.attendance === 'no') attendanceText = "К сожалению, не смогу";
    else if (data.attendance === 'maybe') attendanceText = "Пока не уверен";
    else if (data.attendance === 'yes') attendanceText = "С удовольствием приду";
    else if (data.attendance) attendanceText = data.attendance;
    
    var drinksText = Array.isArray(data.drinks) ? data.drinks.join(', ') : (data.drinks || '—');
    var transferText = data.transferNeeded ? "Да (от ЗАГСа)" : "Нет (свой транспорт)";
    var guestName = (data.guestName || "Без имени").trim();
    var messageText = data.message || "—";
    
    // Проверяем, есть ли уже строка с этим именем (чтобы обновить, если гость изменил выбор)
    var lastRow = sheet.getLastRow();
    var updatedRowIndex = -1;
    if (lastRow > 1) {
      var names = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < names.length; i++) {
        if (String(names[i][0]).toLowerCase().trim() === guestName.toLowerCase()) {
          updatedRowIndex = i + 2;
          break;
        }
      }
    }
    
    if (updatedRowIndex > 0) {
      sheet.getRange(updatedRowIndex, 1, 1, 6).setValues([[
        now,
        guestName,
        attendanceText,
        drinksText,
        transferText,
        messageText
      ]]);
    } else {
      sheet.appendRow([
        now,
        guestName,
        attendanceText,
        drinksText,
        transferText,
        messageText
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", updated: updatedRowIndex > 0 }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: 0,
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    var rsvps = [];
    
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      var name = row[1] ? String(row[1]).trim() : "";
      if (!name) continue;
      
      var rawAttendance = String(row[2] || "");
      var attendance = "yes";
      if (rawAttendance.indexOf("не смогу") !== -1 || rawAttendance.toLowerCase() === "no") {
        attendance = "no";
      } else if (rawAttendance.indexOf("не уверен") !== -1 || rawAttendance.toLowerCase() === "maybe") {
        attendance = "maybe";
      }
      
      var rawDrinks = String(row[3] || "");
      var drinks = [];
      if (rawDrinks && rawDrinks !== "—" && rawDrinks !== "-") {
        drinks = rawDrinks.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
      }
      
      var rawTransfer = String(row[4] || "");
      var transferNeeded = rawTransfer.indexOf("Да") !== -1 || rawTransfer.toLowerCase() === "true";
      
      var message = String(row[5] === "—" || row[5] === "-" ? "" : (row[5] || "")).trim();
      var timestamp = row[0] ? String(row[0]) : new Date().toISOString();
      
      rsvps.push({
        id: "gsheet_" + (i + 2) + "_" + encodeURIComponent(name),
        guestName: name,
        attendance: attendance,
        drinks: drinks,
        transferNeeded: transferNeeded,
        message: message,
        submittedAt: timestamp
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: rsvps.length,
      data: rsvps
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
      data: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export function getGoogleSheetsWebhookUrl(): string {
  // 1. Проверяем config файл проекта (идеально для GitHub Pages — работает для всех гостей)
  if (WEDDING_CONFIG.googleSheetsWebhookUrl && WEDDING_CONFIG.googleSheetsWebhookUrl.startsWith('http')) {
    return WEDDING_CONFIG.googleSheetsWebhookUrl.trim();
  }

  // 2. Проверяем URL параметр (?webhook=... или ?sync=...)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get('webhook') || params.get('sync');
    if (paramUrl && paramUrl.startsWith('http')) {
      const decoded = decodeURIComponent(paramUrl).trim();
      setGoogleSheetsWebhookUrl(decoded);
      return decoded;
    }
  }

  // 3. Проверяем localStorage браузера
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(GOOGLE_SHEETS_STORAGE_KEY) ||
    localStorage.getItem('petr_viktoria_webhook_url') ||
    ''
  ).trim();
}

export function setGoogleSheetsWebhookUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = url.trim();
  if (trimmed) {
    localStorage.setItem(GOOGLE_SHEETS_STORAGE_KEY, trimmed);
    localStorage.setItem('petr_viktoria_webhook_url', trimmed);
  } else {
    localStorage.removeItem(GOOGLE_SHEETS_STORAGE_KEY);
    localStorage.removeItem('petr_viktoria_webhook_url');
  }
}

export async function sendRsvpToGoogleSheets(rsvp: RSVPResponse, customUrl?: string): Promise<boolean> {
  const url = customUrl || getGoogleSheetsWebhookUrl();
  if (!url || !url.startsWith('http')) {
    return false;
  }

  const payload = {
    guestName: rsvp.guestName,
    attendance: rsvp.attendance,
    drinks: rsvp.drinks || [],
    transferNeeded: !!rsvp.transferNeeded,
    message: rsvp.message || '',
    submittedAt: rsvp.submittedAt || new Date().toISOString(),
  };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.warn('Google Sheets sync error:', err);
    return false;
  }
}

/**
 * Читает все ответы гостей из Google Таблицы (через doGet в Google Apps Script).
 * Автоматически обновляет локальное состояние приложения petr_viktoria_all_rsvps.
 */
export async function fetchRsvpsFromGoogleSheets(customUrl?: string): Promise<{
  success: boolean;
  rsvps: RSVPResponse[];
  error?: string;
}> {
  const url = customUrl || getGoogleSheetsWebhookUrl();
  if (!url || !url.startsWith('http')) {
    return { success: false, rsvps: [], error: 'URL Google Таблицы не настроен' };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Статус ответа: ${response.status}`);
    }

    const result = await response.json();
    if (result && result.status === 'success' && Array.isArray(result.data)) {
      const fetched: RSVPResponse[] = result.data;

      // Обновляем локальное хранилище, объединяя с локальными записями
      if (typeof window !== 'undefined') {
        try {
          const localRaw = localStorage.getItem('petr_viktoria_all_rsvps');
          const localRsvps: RSVPResponse[] = localRaw ? JSON.parse(localRaw) : [];

          const map = new Map<string, RSVPResponse>();
          // 1. Добавляем ответы из Google Таблицы (первичный источник правды)
          fetched.forEach((r) => map.set(r.guestName.toLowerCase().trim(), r));
          // 2. Сохраняем локальные ручные записи, если они еще не ушли в таблицу
          localRsvps.forEach((r) => {
            const key = r.guestName.toLowerCase().trim();
            if (!map.has(key)) {
              map.set(key, r);
            }
          });

          const merged = Array.from(map.values());
          localStorage.setItem('petr_viktoria_all_rsvps', JSON.stringify(merged));
          localStorage.setItem('petr_viktoria_last_cloud_sync', new Date().toISOString());
        } catch (e) {
          console.warn('Failed to cache merged rsvps', e);
        }
      }

      return { success: true, rsvps: fetched };
    } else {
      return { success: false, rsvps: [], error: result?.message || 'Не удалось распознать формат таблицы' };
    }
  } catch (err: any) {
    console.warn('Failed to fetch RSVPs from Google Sheets:', err);
    return { success: false, rsvps: [], error: err?.message || 'Ошибка сети при обращении к Google Таблице' };
  }
}

export function getLastCloudSyncTime(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('petr_viktoria_last_cloud_sync');
}

export function exportRsvpsToCsv(rsvps: RSVPResponse[]): void {
  if (!rsvps || rsvps.length === 0) return;

  const headers = ['Имя гостя', 'Статус присутствия', 'Напитки', 'Трансфер', 'Пожелание', 'Дата ответа'];
  const rows = rsvps.map((r) => [
    `"${(r.guestName || '').replace(/"/g, '""')}"`,
    `"${r.attendance === 'yes' ? 'С удовольствием приду' : r.attendance === 'no' ? 'Не смогу' : 'Не уверен'}"`,
    `"${(r.drinks || []).join(', ').replace(/"/g, '""')}"`,
    `"${r.transferNeeded ? 'Да (от ЗАГСа)' : 'Нет (свой транспорт)'}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString('ru-RU') : ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Свадьба_Петра_и_Виктории_Ответы_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

