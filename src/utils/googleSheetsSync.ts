import { RSVPResponse } from '../types';

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
    
    var attendanceText = "Присутствие";
    if (data.attendance === 'yes') attendanceText = "С удовольствием приду";
    else if (data.attendance === 'no') attendanceText = "К сожалению, не смогу";
    else if (data.attendance === 'maybe') attendanceText = "Пока не уверен";
    else if (data.attendance) attendanceText = data.attendance;
    
    var drinksText = Array.isArray(data.drinks) ? data.drinks.join(', ') : (data.drinks || '—');
    var transferText = data.transferNeeded ? "Да (от ЗАГСа)" : "Нет (свой транспорт)";
    
    sheet.appendRow([
      now,
      data.guestName || "Без имени",
      attendanceText,
      drinksText,
      transferText,
      data.message || "—"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Свадебный вебхук Петра и Виктории активен! Готов принимать ответы гостей.")
    .setMimeType(ContentService.MimeType.TEXT);
}`;

export function getGoogleSheetsWebhookUrl(): string {
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
