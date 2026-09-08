/**
 * Конфигурация свадьбы Петра и Виктории
 * 
 * Если вы развертываете сайт на GitHub Pages:
 * Вставьте URL вашего веб-приложения Google Apps Script в поле `googleSheetsWebhookUrl`.
 * 
 * Преимущества:
 * 1. Ответы всех гостей с любых телефонов автоматически сохраняются в вашу Google Таблицу.
 * 2. При открытии сайта на GitHub Pages (на вашем телефоне или компьютере)
 *    приложение САМО обращается к Google Таблице и загружает ответы всех гостей
 *    прямо в интерфейс (список, статистика, напитки, места в трансфере).
 */

export interface WeddingConfig {
  coupleNames: string;
  weddingDate: string; // Формат: YYYY-MM-DD
  organizerPhone: string; // Номер телефона для связи / WhatsApp
  googleSheetsWebhookUrl: string; // URL веб-приложения Google Apps Script (оканчивается на /exec)
}

export const WEDDING_CONFIG: WeddingConfig = {
  coupleNames: 'Петр и Виктория',
  weddingDate: '2026-09-30',
  organizerPhone: '79605850817',
  // URL веб-приложения Google Apps Script
  googleSheetsWebhookUrl: 'https://script.google.com/macros/s/AKfycby26QvuGP7s15Qf1umKXbQuM1TNMA4CCROiLHDqxQYH2otSQ--Vg1ZfbPyjTXoaFK9D/exec',
};
