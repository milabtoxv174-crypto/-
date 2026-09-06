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
} from 'lucide-react';
import { RSVPResponse } from '../types';
import { buildGuestUrl, formatGuestSalutation } from '../utils/greeting';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExitAdmin?: () => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({ isOpen, onClose, onExitAdmin }) => {
  const [activeTab, setActiveTab] = useState<'rsvps' | 'links' | 'settings'>('rsvps');
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [genGuestName, setGenGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInviteText, setCopiedInviteText] = useState(false);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);

  // Manual Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addAttendance, setAddAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [addDrinks, setAddDrinks] = useState<string[]>(['Шампанское / Игристое']);
  const [addTransfer, setAddTransfer] = useState(true);
  const [addNote, setAddNote] = useState('');

  // Settings State
  const [organizerPhone, setOrganizerPhone] = useState('79605850817');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

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
    const savedWebhook = localStorage.getItem('petr_viktoria_webhook_url') || '';
    setOrganizerPhone(savedPhone);
    setWebhookUrl(savedWebhook);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('petr_viktoria_organizer_phone', organizerPhone.trim());
    localStorage.setItem('petr_viktoria_webhook_url', webhookUrl.trim());
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
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

  useEffect(() => {
    if (isOpen) {
      loadRSVPs();
      loadSettings();
    }
  }, [isOpen]);

  const handleCopyPersonalLink = () => {
    if (!genGuestName.trim()) return;
    const url = buildGuestUrl(genGuestName.trim());
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyInviteMessage = () => {
    if (!genGuestName.trim()) return;
    const url = buildGuestUrl(genGuestName.trim());
    const salutation = formatGuestSalutation(genGuestName.trim());
    const text = `${salutation}\nМы с радостью приглашаем вас на нашу свадьбу 30 сентября 2026 года в Смоленске (Клуб-Отель «Высокое»).\n\nВаше персональное приглашение доступно по ссылке:\n${url}\n\nПожалуйста, подтвердите присутствие в анкете гостя! С любовью, Петр и Виктория 💍`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedInviteText(true);
      setTimeout(() => setCopiedInviteText(false), 3000);
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
        <div className="flex border-b border-[#c5a059]/30 bg-[#07201a] px-4 gap-2">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-3 px-3 sm:px-4 text-xs font-sans-clean font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'rsvps'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#fdfcf0]/70 hover:text-[#fdfcf0]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Ответы гостей ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`py-3 px-3 sm:px-4 text-xs font-sans-clean font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#fdfcf0]/70 hover:text-[#fdfcf0]'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Генератор ссылок</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 sm:px-4 text-xs font-sans-clean font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#fdfcf0]/70 hover:text-[#fdfcf0]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Как получать ответы</span>
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
              <div className="bg-[#051a14] border border-[#c5a059] rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-center space-x-2 text-[#ffd700]">
                  <LinkIcon className="w-4 h-4 text-[#ffd700]" />
                  <h4 className="font-serif-display text-base font-semibold text-[#fdfcf0]">
                    Генератор персональных приглашений для гостей
                  </h4>
                </div>
                <p className="text-xs text-[#fdfcf0]/80 font-sans-clean leading-relaxed">
                  Введите имя гостя (или пары), чтобы получить персональную ссылку. При открытии сайт встретит гостя по имени и автоматически заполнит его имя в анкете!
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={genGuestName}
                    onChange={(e) => setGenGuestName(e.target.value)}
                    placeholder="Имя гостя (например: Иван или Иван и Мария)..."
                    className="flex-1 bg-[#0a2a22] border border-[#1d5844] focus:border-[#c5a059] rounded-lg px-3 py-2.5 text-xs text-[#ffffff] placeholder-[#719b8c] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPersonalLink}
                    disabled={!genGuestName.trim()}
                    className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#dfba6d] disabled:opacity-40 text-[#051a14] font-medium text-xs rounded-lg transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ссылка скопирована!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Скопировать ссылку</span>
                      </>
                    )}
                  </button>
                </div>

                {genGuestName.trim() && (
                  <div className="bg-[#0a2a22]/70 border border-[#c5a059]/30 rounded-lg p-3 text-xs font-sans-clean space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#ffd700]">
                      <span>Обращение на сайте: <strong>{formatGuestSalutation(genGuestName)}</strong></span>
                      <button
                        type="button"
                        onClick={handleCopyInviteMessage}
                        className="text-sky-300 hover:text-sky-200 underline cursor-pointer text-[11px] text-left"
                      >
                        {copiedInviteText ? '✓ Текст скопирован в буфер' : '📋 Скопировать готовое сообщение для Telegram/WhatsApp'}
                      </button>
                    </div>
                    <div className="p-2 bg-[#051a14] rounded border border-[#1d5844] font-mono text-[11px] text-[#c5a059] break-all select-all">
                      {buildGuestUrl(genGuestName)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & INSTRUCTIONS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-[#051a14] border border-[#c5a059]/60 rounded-xl p-4 sm:p-5 space-y-4 text-xs font-sans-clean">
                <h4 className="font-serif-display text-base text-[#ffffff] font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#ffd700]" />
                  <span>Куда гостям отправлять ответы</span>
                </h4>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#c5a059] uppercase mb-1">
                      Номер телефона для WhatsApp (куда отправляются ответы):
                    </label>
                    <input
                      type="text"
                      value={organizerPhone}
                      onChange={(e) => setOrganizerPhone(e.target.value)}
                      placeholder="79605850817"
                      className="w-full bg-[#0a2a22] border border-[#1d5844] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-[#ffffff] focus:outline-none"
                    />
                    <span className="text-[11px] text-[#fdfcf0]/60 block mt-1">
                      По умолчанию указан номер координатора Алины (+7 960 585-08-17). Вы можете вписать свой номер телефона.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#c5a059] uppercase mb-1">
                      Webhook URL (опционально для Google Таблицы / Telegram бота):
                    </label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full bg-[#0a2a22] border border-[#1d5844] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-[#ffffff] focus:outline-none"
                    />
                    <span className="text-[11px] text-[#fdfcf0]/60 block mt-1">
                      Если у вас есть Google Apps Script или Formspree, вставьте ссылку сюда — каждый ответ гостя будет автоматически отправляться туда.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#c5a059] hover:bg-[#dfba6d] text-[#051a14] font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    {settingsSaved ? '✓ Сохранено!' : 'Сохранить настройки'}
                  </button>
                </form>
              </div>

              {/* Secret Admin Link Card */}
              <div className="bg-[#051a14] border-2 border-[#ffd700]/70 rounded-xl p-4 sm:p-5 space-y-3 text-xs font-sans-clean">
                <div className="flex items-center space-x-2 text-[#ffd700]">
                  <Key className="w-4 h-4 text-[#ffd700]" />
                  <span className="font-serif-display text-base font-semibold text-[#fdfcf0]">
                    Секретная ссылка для доступа организатора
                  </span>
                </div>
                <p className="text-xs text-[#fdfcf0]/80 leading-relaxed">
                  Обычные гости по персональным ссылкам <strong>не видят</strong> кнопку панели организатора. Чтобы открыть панель на любом устройстве, используйте секретную ссылку с параметром <code className="text-[#ffd700] bg-[#0a2a22] px-1 py-0.5 rounded">?admin=true</code> или кликните 3 раза по именам «Петр &amp; Виктория» в подвале сайта.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?admin=true` : ''}
                    className="flex-1 bg-[#0a2a22] border border-[#1d5844] rounded-lg px-3 py-2 text-[11px] text-[#c5a059] font-mono select-all"
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
                        <span>Скопировать админ-ссылку</span>
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
