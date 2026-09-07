import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  Users,
  CheckCircle2,
  Bus,
  Wine,
  Trash2,
  Download,
  Plus,
  Phone,
  MessageSquare,
  Send,
  Link as LinkIcon,
  Copy,
  Check,
  Sparkles,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Lock,
  Key,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { RSVPResponse } from '../types';
import { buildGuestUrl, formatGuestSalutation } from '../utils/greeting';
import {
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  getGoogleSheetsWebhookUrl,
  setGoogleSheetsWebhookUrl,
  sendRsvpToGoogleSheets,
  exportRsvpsToCsv,
} from '../utils/googleSheetsSync';

interface SavedGuestLink {
  id: string;
  name: string;
  salutation: string;
  url: string;
  createdAt: number;
}

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'rsvps' | 'links' | 'sheets' | 'settings';
  onExitAdmin?: () => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'links',
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'rsvps' | 'links' | 'sheets' | 'settings'>(defaultTab);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [genGuestName, setGenGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInviteText, setCopiedInviteText] = useState(false);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const [savedGuestLinks, setSavedGuestLinks] = useState<SavedGuestLink[]>([]);

  // Manual Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addAttendance, setAddAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [addDrinks, setAddDrinks] = useState<string[]>(['Шампанское / Игристое']);
  const [addTransfer, setAddTransfer] = useState(true);
  const [addNote, setAddNote] = useState('');

  // Settings & Google Sheets State
  const [organizerPhone, setOrganizerPhone] = useState('79605850817');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [googleSheetsSaved, setGoogleSheetsSaved] = useState(false);
  const [testSyncStatus, setTestSyncStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [testSyncMessage, setTestSyncMessage] = useState<string | null>(null);
  const [bulkSyncStatus, setBulkSyncStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [bulkSyncMessage, setBulkSyncMessage] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);

  const drinkOptions = [
    'Шампанское / Игристое',
    'Красное вино',
    'Белое вино',
    'Виски',
    'Водка',
    'Безалкогольные напитки / Соки',
  ];

  const loadSettings = () => {
    const savedPhone = localStorage.getItem('petr_viktoria_organizer_phone') || '79605850817';
    const savedWebhook = getGoogleSheetsWebhookUrl();
    setOrganizerPhone(savedPhone);
    setWebhookUrl(savedWebhook);
    setGoogleSheetsUrl(savedWebhook);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('petr_viktoria_organizer_phone', organizerPhone.trim());
    setGoogleSheetsWebhookUrl(webhookUrl.trim());
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSaveGoogleSheetsUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGoogleSheetsWebhookUrl(googleSheetsUrl);
    setWebhookUrl(googleSheetsUrl.trim());
    setGoogleSheetsSaved(true);
    setTimeout(() => setGoogleSheetsSaved(false), 2500);
  };

  const handleTestGoogleSheets = async () => {
    const url = googleSheetsUrl.trim();
    if (!url) {
      setTestSyncStatus('error');
      setTestSyncMessage('Сначала введите ссылку на веб-приложение Google Таблицы.');
      return;
    }
    setTestSyncStatus('sending');
    setTestSyncMessage('Отправляем тестовую строку...');

    const testRsvp: RSVPResponse = {
      id: 'test_' + Date.now(),
      guestName: 'Тестовый Гость (Проверка связи)',
      attendance: 'yes',
      drinks: ['Шампанское / Игристое', 'Белое вино'],
      transferNeeded: true,
      message: 'Тест синхронизации с Google Таблицей прошел успешно!',
      submittedAt: new Date().toISOString(),
    };

    const success = await sendRsvpToGoogleSheets(testRsvp, url);
    if (success) {
      setTestSyncStatus('success');
      setTestSyncMessage('✓ Тестовый запрос отправлен! Проверьте вашу Google Таблицу — в ней появилась строка с тестовым гостем.');
    } else {
      setTestSyncStatus('error');
      setTestSyncMessage('Ошибка при отправке. Проверьте правильность URL веб-приложения Google Таблицы (должен оканчиваться на /exec).');
    }
  };

  const handleBulkSyncToGoogleSheets = async () => {
    const url = googleSheetsUrl.trim();
    if (!url) {
      setBulkSyncStatus('error');
      setBulkSyncMessage('Сначала сохраните ссылку на Google Таблицу.');
      return;
    }
    if (rsvps.length === 0) {
      setBulkSyncStatus('error');
      setBulkSyncMessage('Список ответов гостей пока пуст.');
      return;
    }

    setBulkSyncStatus('sending');
    setBulkSyncMessage(`Синхронизация ${rsvps.length} ответов...`);

    let sent = 0;
    for (const r of rsvps) {
      await sendRsvpToGoogleSheets(r, url);
      sent++;
    }

    setBulkSyncStatus('success');
    setBulkSyncMessage(`✓ Все ответы (${sent}) успешно отправлены в Google Таблицу!`);
  };

  const handleCopyAppsScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    }
  };

  const loadRSVPs = () => {
    try {
      const raw = localStorage.getItem('petr_viktoria_all_rsvps');
      if (raw) {
        setRsvps(JSON.parse(raw));
      } else {
        setRsvps([]);
      }
    } catch (e) {
      console.warn('Failed to read rsvps', e);
    }
  };

  const loadSavedLinks = () => {
    try {
      const raw = localStorage.getItem('petr_viktoria_saved_guest_links');
      if (raw) {
        setSavedGuestLinks(JSON.parse(raw));
      } else {
        setSavedGuestLinks([]);
      }
    } catch (e) {
      console.warn('Failed to read saved links', e);
    }
  };

  const saveGuestLinkToList = (name: string, url: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const salutation = formatGuestSalutation(trimmed);
    const existing = savedGuestLinks.find((l) => l.name.toLowerCase() === trimmed.toLowerCase());
    let updated: SavedGuestLink[];
    if (existing) {
      updated = savedGuestLinks.map((l) =>
        l.id === existing.id ? { ...l, url, salutation, createdAt: Date.now() } : l
      );
    } else {
      const newEntry: SavedGuestLink = {
        id: 'link_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: trimmed,
        salutation,
        url,
        createdAt: Date.now(),
      };
      updated = [newEntry, ...savedGuestLinks];
    }
    setSavedGuestLinks(updated);
    try {
      localStorage.setItem('petr_viktoria_saved_guest_links', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save links to localStorage', e);
    }
  };

  const handleDeleteSavedLink = (id: string) => {
    const updated = savedGuestLinks.filter((l) => l.id !== id);
    setSavedGuestLinks(updated);
    try {
      localStorage.setItem('petr_viktoria_saved_guest_links', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to delete saved link', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRSVPs();
      loadSettings();
      loadSavedLinks();
      if (defaultTab) {
        setActiveTab(defaultTab);
      }
    }
  }, [isOpen, defaultTab]);

  const handleCopyPersonalLink = () => {
    if (!genGuestName.trim()) return;
    const url = buildGuestUrl(genGuestName.trim());
    saveGuestLinkToList(genGuestName.trim(), url);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyInviteMessage = () => {
    if (!genGuestName.trim()) return;
    const url = buildGuestUrl(genGuestName.trim());
    saveGuestLinkToList(genGuestName.trim(), url);
    const salutation = formatGuestSalutation(genGuestName.trim());
    const text = `${salutation}\nМы с радостью приглашаем вас на нашу свадьбу 30 сентября 2026 года в Смоленске (Клуб-Отель «Высокое»).\n\nВаше персональное приглашение доступно по ссылке:\n${url}\n\nПожалуйста, подтвердите присутствие в анкете гостя! С любовью, Петр и Виктория 💍`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedInviteText(true);
      setTimeout(() => setCopiedInviteText(false), 3000);
    }
  };

  const handleCopyExistingLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyExistingMessage = (name: string, url: string) => {
    const salutation = formatGuestSalutation(name);
    const text = `${salutation}\nМы с радостью приглашаем вас на нашу свадьбу 30 сентября 2026 года в Смоленске (Клуб-Отель «Высокое»).\n\nВаше персональное приглашение доступно по ссылке:\n${url}\n\nПожалуйста, подтвердите присутствие в анкете гостя! С любовью, Петр и Виктория 💍`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedInviteText(true);
      setTimeout(() => setCopiedInviteText(false), 2500);
    }
  };

  const handleCopyAdminLink = () => {
    const adminUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?admin=true`
      : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(adminUrl);
      setCopiedAdminLink(true);
      setTimeout(() => setCopiedAdminLink(false), 3000);
    }
  };

  const handleAddManualGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    const newRsvp: RSVPResponse = {
      id: Date.now().toString(),
      guestName: addName.trim(),
      attendance: addAttendance,
      drinks: addAttendance === 'yes' ? addDrinks : [],
      transferNeeded: addAttendance === 'yes' ? addTransfer : false,
      message: addNote.trim(),
      submittedAt: new Date().toISOString(),
    };

    const updated = [newRsvp, ...rsvps];
    localStorage.setItem('petr_viktoria_all_rsvps', JSON.stringify(updated));
    setRsvps(updated);

    // Reset form
    setAddName('');
    setAddNote('');
    setShowAddForm(false);
  };

  const handleDeleteGuest = (id: string) => {
    const updated = rsvps.filter((r) => r.id !== id);
    localStorage.setItem('petr_viktoria_all_rsvps', JSON.stringify(updated));
    setRsvps(updated);
  };

  const addDemoRSVPs = () => {
    const demo: RSVPResponse[] = [
      {
        id: '1',
        guestName: 'Михаил и Елена Соколовы',
        attendance: 'yes',
        drinks: ['Красное вино', 'Виски'],
        transferNeeded: true,
        message: 'Поздравляем Петра и Викторию! Ждем с нетерпением праздника!',
        submittedAt: new Date().toISOString(),
      },
      {
        id: '2',
        guestName: 'Ольга Васильева',
        attendance: 'yes',
        drinks: ['Шампанское / Игристое', 'Белое вино'],
        transferNeeded: true,
        message: 'Очень рада за вас! До встречи в Смоленске!',
        submittedAt: new Date().toISOString(),
      },
      {
        id: '3',
        guestName: 'Артем и Дарья',
        attendance: 'yes',
        drinks: ['Виски', 'Безалкогольные напитки / Соки'],
        transferNeeded: false,
        message: 'Будем на своей машине. Легкой вам подготовки!',
        submittedAt: new Date().toISOString(),
      },
      {
        id: '4',
        guestName: 'Сергей Николаевич',
        attendance: 'no',
        drinks: [],
        transferNeeded: false,
        message: 'К сожалению, в эти даты буду в командировке. Счастья молодым!',
        submittedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem('petr_viktoria_all_rsvps', JSON.stringify(demo));
    setRsvps(demo);
  };

  const clearAllRSVPs = () => {
    if (window.confirm('Вы уверены, что хотите очистить список ответов?')) {
      localStorage.removeItem('petr_viktoria_all_rsvps');
      setRsvps([]);
    }
  };

  const exportCSV = () => {
    if (rsvps.length === 0) return;
    const headers = 'Имя гостя,Присутствие,Напитки,Трансфер,Пожелания,Дата\n';
    const rows = rsvps
      .map(
        (r) =>
          `"${r.guestName}","${
            r.attendance === 'yes' ? 'Да' : r.attendance === 'no' ? 'Нет' : 'Позже'
          }","${r.drinks.join('; ')}","${
            r.transferNeeded ? 'Да (до Высокого)' : 'Нет'
          }","${r.message || ''}","${r.submittedAt}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Свадьба_Петра_и_Виктории_Гости_RSVP.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const totalAttending = rsvps.filter((r) => r.attendance === 'yes').length;
  const totalDeclined = rsvps.filter((r) => r.attendance === 'no').length;
  const totalMaybe = rsvps.filter((r) => r.attendance === 'maybe').length;
  const totalTransfers = rsvps.filter((r) => r.attendance === 'yes' && r.transferNeeded).length;

  // Drinks stats
  const drinkCounts: Record<string, number> = {};
  rsvps.forEach((r) => {
    if (r.attendance === 'yes' && r.drinks) {
      r.drinks.forEach((d) => {
        drinkCounts[d] = (drinkCounts[d] || 0) + 1;
      });
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0a2a22] border-2 border-[#c5a059] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#051a14] border-b border-[#c5a059]/40">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#ffd700]" />
            <h3 className="font-serif-display text-lg sm:text-xl text-[#fdfcf0] font-medium">
              Панель организатора / Молодоженов
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {onExitAdmin && (
              <button
                type="button"
                onClick={onExitAdmin}
                className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Выйти из режима координатора (скрыть кнопку внизу)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Скрыть панель</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#fdfcf0]/70 hover:text-[#fdfcf0] hover:bg-[#0a2a22] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#c5a059]/30 bg-[#07201a] px-3 sm:px-4 gap-1.5 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('links')}
            className={`py-3 px-2.5 sm:px-3 text-xs font-sans-clean font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'links'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#fdfcf0]/70 hover:text-[#fdfcf0]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Ссылки гостей</span>
          </button>

          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-3 px-2.5 sm:px-3 text-xs font-sans-clean font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rsvps'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#fdfcf0]/70 hover:text-[#fdfcf0]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ответы ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-2.5 sm:px-3 text-xs font-sans-clean font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#fdfcf0]/70 hover:text-[#fdfcf0]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="flex items-center gap-1">
              <span>Google Таблица</span>
              {googleSheetsUrl ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Подключено" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400/80 inline-block" title="Требуется ссылка" />
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-2.5 sm:px-3 text-xs font-sans-clean font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#fdfcf0]/70 hover:text-[#fdfcf0]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Настройки</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* TAB 1: RSVPS */}
          {activeTab === 'rsvps' && (
            <div className="space-y-5">
              {/* Top Help Banner */}
              <div className="bg-[#051a14] border border-[#c5a059]/60 rounded-xl p-3.5 sm:p-4 text-xs font-sans-clean leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-[#ffd700] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Как собираются ответы:</span>
                </div>
                <p className="text-[#fdfcf0]/90">
                  1. <strong>В мессенджерах:</strong> Гости нажимают кнопку «Отправить в WhatsApp/Telegram» в анкете, и готовый ответ сразу приходит вам.
                  <br />
                  2. <strong>Вручную:</strong> Если гость позвонил или написал вам лично, нажмите кнопку <strong>«+ Добавить гостя вручную»</strong> ниже, чтобы он попал в общую статистику и таблицу.
                </p>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#051a14] border border-emerald-700/60 p-3 rounded-xl text-center shadow">
                  <div className="font-serif-display text-2xl sm:text-3xl font-bold text-emerald-400">
                    {totalAttending}
                  </div>
                  <div className="font-sans-clean text-[10px] sm:text-xs text-[#fdfcf0]/80 uppercase tracking-wider">
                    Будут присутствовать
                  </div>
                </div>

                <div className="bg-[#051a14] border border-rose-800/60 p-3 rounded-xl text-center shadow">
                  <div className="font-serif-display text-2xl sm:text-3xl font-bold text-rose-400">
                    {totalDeclined}
                  </div>
                  <div className="font-sans-clean text-[10px] sm:text-xs text-[#fdfcf0]/80 uppercase tracking-wider">
                    Не смогут приехать
                  </div>
                </div>

                <div className="bg-[#051a14] border border-[#c5a059]/50 p-3 rounded-xl text-center shadow">
                  <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#ffd700]">
                    {totalTransfers}
                  </div>
                  <div className="font-sans-clean text-[10px] sm:text-xs text-[#fdfcf0]/80 uppercase tracking-wider">
                    Мест в трансфере
                  </div>
                </div>

                <div className="bg-[#051a14] border border-[#c5a059]/50 p-3 rounded-xl text-center shadow">
                  <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#ffffff]">
                    {rsvps.length}
                  </div>
                  <div className="font-sans-clean text-[10px] sm:text-xs text-[#fdfcf0]/80 uppercase tracking-wider">
                    Всего в списке
                  </div>
                </div>
              </div>

              {/* Drinks breakdown card */}
              {Object.keys(drinkCounts).length > 0 && (
                <div className="bg-[#051a14] border border-[#c5a059]/40 rounded-xl p-3.5 text-xs font-sans-clean">
                  <div className="font-semibold text-[#ffd700] mb-2 flex items-center gap-1.5">
                    <Wine className="w-3.5 h-3.5" />
                    <span>Потребность по напиткам для банкета:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(drinkCounts).map(([drink, count]) => (
                      <span
                        key={drink}
                        className="bg-[#0a2a22] border border-[#c5a059]/40 px-2.5 py-1 rounded-lg text-[#fdfcf0] text-[11px]"
                      >
                        {drink}: <strong className="text-[#ffd700]">{count}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#c5a059]/30">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3.5 py-2 bg-[#c5a059] hover:bg-[#d8b46e] text-[#051a14] text-xs font-sans-clean font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddForm ? 'Скрыть форму' : 'Добавить гостя вручную'}</span>
                  </button>

                  <button
                    onClick={exportCSV}
                    disabled={rsvps.length === 0}
                    className="px-3 py-2 bg-[#051a14] hover:bg-[#113a30] disabled:opacity-40 text-[#fdfcf0] text-xs font-sans-clean rounded-lg border border-[#c5a059]/60 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Скачать Excel (CSV)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {rsvps.length === 0 && (
                    <button
                      onClick={addDemoRSVPs}
                      className="px-3 py-1.5 bg-[#051a14] hover:bg-[#113a30] text-[#c5a059] text-xs font-sans-clean rounded-lg border border-[#c5a059]/50 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Примеры ответов</span>
                    </button>
                  )}

                  {rsvps.length > 0 && (
                    <button
                      onClick={clearAllRSVPs}
                      className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-sans-clean rounded-lg border border-red-800/50 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Очистить</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Add Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddManualGuest}
                  className="bg-[#051a14] border-2 border-[#ffd700] rounded-xl p-4 sm:p-5 space-y-4 animate-fadeIn"
                >
                  <h4 className="font-serif-display text-base text-[#ffffff] font-semibold">
                    Добавление гостя в список
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-[#c5a059] uppercase mb-1">
                      Имя и фамилия гостя *
                    </label>
                    <input
                      type="text"
                      required
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                      placeholder="Например: Дядя Сергей и тетя Лена"
                      className="w-full bg-[#0a2a22] border border-[#1d5844] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-[#ffffff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#c5a059] uppercase mb-1">
                      Статус присутствия
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setAddAttendance('yes')}
                        className={`py-2 px-2 rounded text-xs font-semibold cursor-pointer border ${
                          addAttendance === 'yes'
                            ? 'bg-emerald-800 border-emerald-400 text-white'
                            : 'bg-[#0a2a22] border-[#c5a059]/40 text-[#fdfcf0]/70'
                        }`}
                      >
                        Придет
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddAttendance('no')}
                        className={`py-2 px-2 rounded text-xs font-semibold cursor-pointer border ${
                          addAttendance === 'no'
                            ? 'bg-rose-800 border-rose-400 text-white'
                            : 'bg-[#0a2a22] border-[#c5a059]/40 text-[#fdfcf0]/70'
                        }`}
                      >
                        Не сможет
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddAttendance('maybe')}
                        className={`py-2 px-2 rounded text-xs font-semibold cursor-pointer border ${
                          addAttendance === 'maybe'
                            ? 'bg-amber-800 border-amber-400 text-white'
                            : 'bg-[#0a2a22] border-[#c5a059]/40 text-[#fdfcf0]/70'
                        }`}
                      >
                        Позже
                      </button>
                    </div>
                  </div>

                  {addAttendance === 'yes' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-[#c5a059] uppercase mb-1">
                          Напитки
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {drinkOptions.map((drink) => {
                            const selected = addDrinks.includes(drink);
                            return (
                              <button
                                key={drink}
                                type="button"
                                onClick={() => {
                                  if (selected) {
                                    setAddDrinks(addDrinks.filter((d) => d !== drink));
                                  } else {
                                    setAddDrinks([...addDrinks, drink]);
                                  }
                                }}
                                className={`p-2 rounded text-[11px] text-left border cursor-pointer ${
                                  selected
                                    ? 'bg-[#0a2a22] border-[#ffd700] text-white font-semibold'
                                    : 'bg-[#051a14] border-[#c5a059]/30 text-[#fdfcf0]/70'
                                }`}
                              >
                                {drink} {selected ? '✓' : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-[#0a2a22] rounded-lg border border-[#c5a059]/40">
                        <span className="text-xs text-[#fdfcf0]">Нужен трансфер до Высокого:</span>
                        <input
                          type="checkbox"
                          checked={addTransfer}
                          onChange={(e) => setAddTransfer(e.target.checked)}
                          className="w-4 h-4 accent-[#ffd700]"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#c5a059] uppercase mb-1">
                      Примечание или пожелание
                    </label>
                    <input
                      type="text"
                      value={addNote}
                      onChange={(e) => setAddNote(e.target.value)}
                      placeholder="Любые заметки для организатора..."
                      className="w-full bg-[#0a2a22] border border-[#1d5844] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-[#ffffff] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-2 text-xs text-[#fdfcf0]/70 hover:text-white cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#ffd700] text-[#051a14] font-bold text-xs rounded-lg hover:bg-yellow-300 transition-colors cursor-pointer"
                    >
                      Сохранить в список
                    </button>
                  </div>
                </form>
              )}

              {/* Guest responses list */}
              {rsvps.length === 0 ? (
                <div className="py-8 text-center text-[#fdfcf0]/70 font-sans-clean text-xs bg-[#051a14] rounded-xl border border-[#c5a059]/30 p-6">
                  <Users className="w-8 h-8 mx-auto text-[#c5a059] mb-2 opacity-60" />
                  Ответов пока нет. Нажмите «+ Добавить гостя вручную» или «Примеры ответов».
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rsvps.map((rsvp) => (
                    <div
                      key={rsvp.id}
                      className="bg-[#051a14] border border-[#c5a059]/40 rounded-xl p-3.5 sm:p-4 font-sans-clean text-xs space-y-2 hover:border-[#c5a059] transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-semibold text-sm text-[#fdfcf0] block">
                            {rsvp.guestName}
                          </span>
                          <span className="text-[10px] text-[#fdfcf0]/50">
                            {new Date(rsvp.submittedAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${
                              rsvp.attendance === 'yes'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : rsvp.attendance === 'no'
                                ? 'bg-red-950 text-red-300 border border-red-700'
                                : 'bg-amber-950 text-amber-300 border border-amber-700'
                            }`}
                          >
                            {rsvp.attendance === 'yes'
                              ? 'Придет'
                              : rsvp.attendance === 'no'
                              ? 'Не сможет'
                              : 'Позже'}
                          </span>

                          <button
                            onClick={() => handleDeleteGuest(rsvp.id)}
                            className="text-[#fdfcf0]/40 hover:text-red-400 p-1 cursor-pointer transition-colors"
                            title="Удалить запись"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {rsvp.attendance === 'yes' && (
                        <div className="text-[#fdfcf0]/80 space-y-1 pt-1 border-t border-[#c5a059]/20">
                          <div>
                            <span className="text-[#c5a059]">Напитки:</span>{' '}
                            {rsvp.drinks && rsvp.drinks.length > 0 ? rsvp.drinks.join(', ') : 'Не указаны'}
                          </div>
                          <div>
                            <span className="text-[#c5a059]">Трансфер:</span>{' '}
                            {rsvp.transferNeeded ? 'Да (до Высокого)' : 'Нет (свой транспорт)'}
                          </div>
                        </div>
                      )}

                      {rsvp.message && (
                        <div className="pt-1 text-[#ffd700] italic">
                          «{rsvp.message}»
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LINK GENERATOR */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* How it works info box */}
              <div className="bg-[#051a14] border border-[#c5a059] rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-center space-x-2 text-[#ffd700]">
                  <LinkIcon className="w-4 h-4 text-[#ffd700]" />
                  <h4 className="font-serif-display text-base font-semibold text-[#fdfcf0]">
                    Генератор персональных приглашений для гостей
                  </h4>
                </div>

                <div className="bg-[#0a2a22] border border-[#c5a059]/40 rounded-lg p-3 text-xs space-y-2 text-[#fdfcf0]/90">
                  <div className="flex items-start gap-2">
                    <span className="text-[#ffd700] text-sm leading-none mt-0.5">👑</span>
                    <div>
                      <strong className="text-[#ffd700]">Ваша основная ссылка:</strong> это ссылка организатора, по которой вы находитесь сейчас. Здесь доступны создание ссылок, редактирование и список ответов.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 text-sm leading-none mt-0.5">💌</span>
                    <div>
                      <strong className="text-emerald-300">Персональная ссылка гостя:</strong> готовый формат без редактирования! Гость открывает её и видит приглашение со своим именем («Дорогой Иван!», «Дорогие Иван и Мария!»), а панель организатора для него полностью скрыта.
                    </div>
                  </div>
                </div>

                {/* Quick Name Suggestions */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider">
                    Быстрый выбор или пример:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Иван', 'Анна', 'Иван и Мария', 'Семья Ивановых', 'Мама и Папа', 'Бабушка и Дедушка'].map((template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() => setGenGuestName(template)}
                        className="px-2.5 py-1 bg-[#0a2a22] hover:bg-[#133e31] border border-[#c5a059]/40 hover:border-[#ffd700] rounded text-[11px] text-[#fdfcf0] cursor-pointer transition-colors"
                      >
                        + {template}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Input & Generate Button */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={genGuestName}
                    onChange={(e) => setGenGuestName(e.target.value)}
                    placeholder="Введите имя гостя (например: Иван или Иван и Мария)..."
                    className="flex-1 bg-[#0a2a22] border border-[#1d5844] focus:border-[#c5a059] rounded-lg px-3 py-2.5 text-xs text-[#ffffff] placeholder-[#719b8c] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPersonalLink}
                    disabled={!genGuestName.trim()}
                    className="px-4 py-2.5 bg-[#ffd700] hover:bg-[#ffe234] disabled:opacity-40 text-[#051a14] font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer shadow"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#051a14]" />
                        <span>Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Скопировать ссылку</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Action Card when name is filled */}
                {genGuestName.trim() && (
                  <div className="bg-[#0a2a22] border border-[#c5a059]/60 rounded-lg p-3.5 text-xs font-sans-clean space-y-3 mt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                      <span className="text-[#fdfcf0]">
                        Обращение к гостю: <strong className="text-[#ffd700]">{formatGuestSalutation(genGuestName)}</strong>
                      </span>
                      <span className="text-emerald-400 font-semibold text-[11px]">
                        ✓ Режим гостя (без редактирования)
                      </span>
                    </div>

                    <div className="p-2 bg-[#051a14] rounded border border-[#1d5844] font-mono text-[11px] text-[#ffd700] break-all select-all">
                      {buildGuestUrl(genGuestName)}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyInviteMessage}
                        className="px-3 py-2 bg-[#051a14] hover:bg-[#0c2f25] border border-[#c5a059] text-[#ffd700] font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {copiedInviteText ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Текст скопирован!</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Скопировать готовый текст для WhatsApp/Telegram</span>
                          </>
                        )}
                      </button>

                      <a
                        href={buildGuestUrl(genGuestName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#0a2a22] hover:bg-[#113a30] text-[#fdfcf0] border border-[#c5a059]/50 hover:border-[#ffd700] rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Открыть в новой вкладке и увидеть, как сайт выглядит для гостя"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>Открыть как гость (в новой вкладке)</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Saved guest links address book */}
              {savedGuestLinks.length > 0 && (
                <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-serif-display text-sm font-semibold text-[#ffd700] flex items-center gap-2">
                      <span>Созданные ссылки для гостей ({savedGuestLinks.length})</span>
                    </h5>
                    <span className="text-[10px] text-[#fdfcf0]/60">
                      Сохранены в памяти вашего браузера
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {savedGuestLinks.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#0a2a22] border border-[#c5a059]/30 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs hover:border-[#c5a059] transition-colors"
                      >
                        <div className="min-w-[140px]">
                          <span className="font-semibold text-[#fdfcf0] block">{item.name}</span>
                          <span className="text-[10px] text-[#c5a059]">{item.salutation}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyExistingLink(item.url)}
                            className="px-2.5 py-1 bg-[#051a14] hover:bg-[#0c2f25] border border-[#c5a059]/40 hover:border-[#ffd700] text-[#ffd700] rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Скопировать ссылку"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Ссылка</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyExistingMessage(item.name, item.url)}
                            className="px-2.5 py-1 bg-[#051a14] hover:bg-[#0c2f25] border border-[#c5a059]/40 hover:border-[#ffd700] text-[#fdfcf0] rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Скопировать готовое сообщение"
                          >
                            <MessageSquare className="w-3 h-3 text-[#c5a059]" />
                            <span>Сообщение</span>
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-[#fdfcf0]/60 hover:text-[#ffd700] transition-colors"
                            title="Открыть как гость в новой вкладке"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteSavedLink(item.id)}
                            className="p-1 text-[#fdfcf0]/40 hover:text-red-400 transition-colors cursor-pointer"
                            title="Удалить из списка"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS INTEGRATION */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              {/* Status Header */}
              <div className="bg-[#051a14] border-2 border-[#c5a059]/70 rounded-xl p-4 sm:p-5 space-y-3 font-sans-clean">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-serif-display text-base sm:text-lg text-[#fdfcf0] font-semibold">
                      Синхронизация с Google Таблицей
                    </h4>
                  </div>
                  {googleSheetsUrl ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 w-fit">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Подключено
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-700/60 w-fit">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Требуется ссылка
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#fdfcf0]/80 leading-relaxed">
                  Когда гость подтверждает присутствие на сайте, ответ мгновенно сохраняется в вашу личную Google Таблицу (имя, статус, напитки, трансфер, пожелание).
                </p>

                {/* URL Input Form */}
                <form onSubmit={handleSaveGoogleSheetsUrl} className="space-y-2 pt-1">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#ffd700]">
                    URL веб-приложения Google Apps Script (заканчивается на /exec):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={googleSheetsUrl}
                      onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-1 bg-[#0a2a22] border border-[#1d5844] focus:border-[#ffd700] rounded-lg px-3 py-2 text-xs text-[#ffffff] font-mono focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#ffd700] hover:bg-[#ffe234] text-[#051a14] font-bold text-xs rounded-lg transition-all cursor-pointer shrink-0"
                    >
                      {googleSheetsSaved ? '✓ Сохранено!' : 'Сохранить ссылку'}
                    </button>
                  </div>
                </form>

                {/* Quick action buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#c5a059]/20">
                  <button
                    type="button"
                    onClick={handleTestGoogleSheets}
                    disabled={testSyncStatus === 'sending'}
                    className="px-3 py-1.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] border border-[#c5a059]/60 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{testSyncStatus === 'sending' ? 'Отправка...' : 'Отправить тестовую строку'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkSyncToGoogleSheets}
                    disabled={bulkSyncStatus === 'sending'}
                    className="px-3 py-1.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#fdfcf0] border border-[#c5a059]/60 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Выгрузить все ответы ({rsvps.length}) в таблицу</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportRsvpsToCsv(rsvps)}
                    className="px-3 py-1.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#fdfcf0]/90 border border-[#c5a059]/40 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Скачать CSV</span>
                  </button>
                </div>

                {/* Feedback notices */}
                {testSyncMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      testSyncStatus === 'success'
                        ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200'
                        : 'bg-red-950/80 border border-red-700/60 text-red-200'
                    }`}
                  >
                    {testSyncMessage}
                  </div>
                )}

                {bulkSyncMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      bulkSyncStatus === 'success'
                        ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200'
                        : 'bg-amber-950/80 border border-amber-700/60 text-amber-200'
                    }`}
                  >
                    {bulkSyncMessage}
                  </div>
                )}
              </div>

              {/* Step-by-Step Setup Guide */}
              <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-4 sm:p-5 space-y-3 text-xs font-sans-clean">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-display text-base text-[#ffd700] font-semibold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#ffd700]" />
                    <span>Как настроить Google Таблицу за 2 минуты</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyAppsScript}
                    className="px-3 py-1.5 bg-[#c5a059] hover:bg-[#dfba6d] text-[#051a14] font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Код скопирован!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Скопировать готовый код скрипта</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2.5 text-[#fdfcf0]/85 leading-relaxed pt-1">
                  <div className="flex items-start gap-2.5 bg-[#0a2a22] p-2.5 rounded-lg border border-[#1d5844]/60">
                    <span className="w-5 h-5 rounded-full bg-[#c5a059] text-[#051a14] font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      Откройте{' '}
                      <a
                        href="https://sheets.new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ffd700] underline font-semibold inline-flex items-center gap-1"
                      >
                        Google Таблицы (нажмите сюда, чтобы создать новую)
                        <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      и назовите её, например: <em>«Свадьба Петра и Виктории — Ответы»</em>.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#0a2a22] p-2.5 rounded-lg border border-[#1d5844]/60">
                    <span className="w-5 h-5 rounded-full bg-[#c5a059] text-[#051a14] font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      В верхнем меню таблицы нажмите <strong>«Расширения»</strong> (Extensions) → <strong>«Apps Script»</strong>.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#0a2a22] p-2.5 rounded-lg border border-[#1d5844]/60">
                    <span className="w-5 h-5 rounded-full bg-[#c5a059] text-[#051a14] font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      В открывшемся окне редактора сотрите весь текст и вставьте готовый код (нажмите кнопку <strong>«Скопировать готовый код скрипта»</strong> выше).
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#0a2a22] p-2.5 rounded-lg border border-[#1d5844]/60">
                    <span className="w-5 h-5 rounded-full bg-[#c5a059] text-[#051a14] font-bold flex items-center justify-center shrink-0 text-xs">
                      4
                    </span>
                    <div>
                      Справа вверху нажмите синюю кнопку <strong>«Начать развертывание»</strong> (Deploy) → <strong>«Новое развертывание»</strong> (New deployment).
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#0a2a22] p-2.5 rounded-lg border border-[#1d5844]/60">
                    <span className="w-5 h-5 rounded-full bg-[#c5a059] text-[#051a14] font-bold flex items-center justify-center shrink-0 text-xs">
                      5
                    </span>
                    <div>
                      Нажмите на шестеренку рядом с «Выберите тип» и выберите <strong>«Веб-приложение»</strong> (Web app).<br />
                      В пункте «У кого есть доступ» (Who has access) обязательно выберите: <strong>«Все» (Anyone)</strong>!
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#0a2a22] p-2.5 rounded-lg border border-[#1d5844]/60">
                    <span className="w-5 h-5 rounded-full bg-[#c5a059] text-[#051a14] font-bold flex items-center justify-center shrink-0 text-xs">
                      6
                    </span>
                    <div>
                      Нажмите <strong>«Развернуть»</strong> (Deploy), скопируйте полученный <strong>URL веб-приложения</strong> (заканчивается на <code>/exec</code>) и вставьте в поле на этой странице. Готово!
                    </div>
                  </div>
                </div>

                {/* Script Code Viewer Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScriptCode(!showScriptCode)}
                    className="text-xs text-[#ffd700]/90 hover:text-[#ffd700] flex items-center gap-1 cursor-pointer"
                  >
                    {showScriptCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{showScriptCode ? 'Скрыть код скрипта' : 'Посмотреть исходный код скрипта'}</span>
                  </button>

                  {showScriptCode && (
                    <div className="mt-2 relative">
                      <pre className="p-3 bg-[#03100c] border border-[#1d5844] rounded-lg text-[11px] text-[#e0e0d0] font-mono overflow-x-auto max-h-60">
                        {GOOGLE_APPS_SCRIPT_TEMPLATE}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & INSTRUCTIONS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Main Host URL Card */}
              <div className="bg-[#051a14] border-2 border-[#ffd700]/70 rounded-xl p-4 sm:p-5 space-y-3 text-xs font-sans-clean">
                <div className="flex items-center space-x-2 text-[#ffd700]">
                  <Key className="w-4 h-4 text-[#ffd700]" />
                  <span className="font-serif-display text-base font-semibold text-[#fdfcf0]">
                    Ваша основная ссылка (для жениха, невесты и организатора)
                  </span>
                </div>
                <p className="text-xs text-[#fdfcf0]/80 leading-relaxed">
                  По этой основной ссылке открывается сайт с доступом к панели управления, созданию ссылок для гостей и синхронизации ответов с Google Таблицей. Сохраните её в закладки!
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''}
                    className="flex-1 bg-[#0a2a22] border border-[#1d5844] rounded-lg px-3 py-2 text-[11px] text-[#ffd700] font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyAdminLink}
                    className="px-3 py-2 bg-[#ffd700] hover:bg-[#ffe234] text-[#051a14] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedAdminLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Скопировать ссылку</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Coordinator card */}
              <div className="bg-[#051a14] border border-[#c5a059]/40 rounded-xl p-4 flex items-center justify-between gap-3 text-xs font-sans-clean">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#c5a059] font-medium">
                    Координатор свадьбы
                  </div>
                  <div className="font-serif-display text-base text-[#fdfcf0]">
                    Алина: +7 (960) 585-08-17
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://wa.me/79605850817"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs hover:bg-emerald-700"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://t.me/+Yskw-Adk00o5YTli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-sky-800 text-white rounded text-xs hover:bg-sky-700"
                  >
                    Чат в Telegram
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
