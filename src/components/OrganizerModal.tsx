import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Users, CheckCircle2, Bus, Wine, Trash2, Download, Plus, Phone, MessageSquare, Send, Link as LinkIcon, Copy, Check, Sparkles } from 'lucide-react';
import { RSVPResponse } from '../types';
import { buildGuestUrl, formatGuestSalutation } from '../utils/greeting';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({ isOpen, onClose }) => {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [genGuestName, setGenGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInviteText, setCopiedInviteText] = useState(false);

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

  const loadRSVPs = () => {
    try {
      const raw = localStorage.getItem('petr_viktoria_all_rsvps');
      if (raw) {
        setRsvps(JSON.parse(raw));
      } else {
        setRsvps([]);
      }
    } catch (e) {
      console.warn("Failed to read rsvps", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRSVPs();
    }
  }, [isOpen]);

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
          `"${r.guestName}","${r.attendance}","${r.drinks.join('; ')}","${
            r.transferNeeded ? 'Да' : 'Нет'
          }","${r.message || ''}","${r.submittedAt}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Wedding_RSVP_List.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const totalAttending = rsvps.filter((r) => r.attendance === 'yes').length;
  const totalTransfers = rsvps.filter((r) => r.attendance === 'yes' && r.transferNeeded).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0a2a22] border border-[#c5a059] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#051a14] border-b border-[#c5a059]/40">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
            <h3 className="font-serif-display text-xl text-[#fdfcf0] font-medium">
              Панель молодоженов / Организатор
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#fdfcf0]/70 hover:text-[#fdfcf0] hover:bg-[#0a2a22] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Coordinator Card */}
          <div className="bg-[#051a14] border border-[#c5a059]/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#0a2a22] border border-[#c5a059] flex items-center justify-center text-[#ffd700] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-sans-clean text-[11px] uppercase tracking-wider text-[#c5a059] font-medium">
                  Координатор свадьбы
                </div>
                <div className="font-serif-display text-lg text-[#fdfcf0] font-medium">
                  Алина • <a href="tel:+79605850817" className="underline hover:text-[#ffd700]">+7 (960) 585-08-17</a>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
              <a
                href="tel:+79605850817"
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] border border-[#c5a059]/60 rounded-lg text-xs font-sans-clean flex items-center justify-center"
              >
                <Phone className="w-3.5 h-3.5 mr-1" />
                Звонок
              </a>
              <a
                href="https://t.me/+79605850817"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-[#0a2a22] hover:bg-[#113a30] text-sky-300 border border-[#c5a059]/60 rounded-lg text-xs font-sans-clean flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5 mr-1 text-sky-400" />
                Telegram
              </a>
            </div>
          </div>

          {/* Personal Link Generator for Couple */}
          <div className="bg-[#051a14] border border-[#c5a059] rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-[#ffd700]">
              <LinkIcon className="w-4 h-4 text-[#ffd700]" />
              <h4 className="font-serif-display text-base font-semibold text-[#fdfcf0]">
                Генератор персональных ссылок для гостей
              </h4>
            </div>
            <p className="text-xs text-[#fdfcf0]/80 font-sans-clean leading-relaxed">
              Введите имя гостя (или пары), чтобы получить персонализированную ссылку. При открытии сайт встретит гостя по имени и автоматически подставит его имя в форму RSVP!
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={genGuestName}
                onChange={(e) => setGenGuestName(e.target.value)}
                placeholder="Имя гостя (например: Анна или Михаил и Елена)..."
                className="flex-1 bg-[#0a2a22] border border-[#1d5844] focus:border-[#c5a059] rounded-lg px-3 py-2 text-xs text-[#ffffff] placeholder-[#719b8c] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyPersonalLink}
                disabled={!genGuestName.trim()}
                className="px-4 py-2 bg-[#c5a059] hover:bg-[#dfba6d] disabled:opacity-40 text-[#051a14] font-medium text-xs rounded-lg transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
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
              <div className="bg-[#0a2a22]/70 border border-[#c5a059]/30 rounded-lg p-2.5 text-xs font-sans-clean space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#ffd700]">
                  <span>Обращение на сайте: <strong>{formatGuestSalutation(genGuestName)}</strong></span>
                  <button
                    type="button"
                    onClick={handleCopyInviteMessage}
                    className="text-sky-300 hover:text-sky-200 underline cursor-pointer text-[11px]"
                  >
                    {copiedInviteText ? '✓ Текст приглашения скопирован' : '📋 Скопировать готовый текст для мессенджера'}
                  </button>
                </div>
                <div className="p-1.5 bg-[#051a14] rounded border border-[#1d5844] font-mono text-[11px] text-[#c5a059] break-all select-all">
                  {buildGuestUrl(genGuestName)}
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#051a14] border border-[#c5a059]/40 p-3.5 rounded-lg text-center">
              <div className="font-serif-display text-2xl font-bold text-[#c5a059]">
                {totalAttending}
              </div>
              <div className="font-sans-clean text-[11px] text-[#fdfcf0]/70 uppercase">
                Подтвердили участие
              </div>
            </div>

            <div className="bg-[#051a14] border border-[#c5a059]/40 p-3.5 rounded-lg text-center">
              <div className="font-serif-display text-2xl font-bold text-[#c5a059]">
                {totalTransfers}
              </div>
              <div className="font-sans-clean text-[11px] text-[#fdfcf0]/70 uppercase">
                Нужен трансфер
              </div>
            </div>

            <div className="bg-[#051a14] border border-[#c5a059]/40 p-3.5 rounded-lg text-center col-span-2 sm:col-span-1">
              <div className="font-serif-display text-2xl font-bold text-[#c5a059]">
                {rsvps.length}
              </div>
              <div className="font-sans-clean text-[11px] text-[#fdfcf0]/70 uppercase">
                Всего ответов
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#c5a059]/30">
            <div className="flex items-center space-x-2">
              <button
                onClick={exportCSV}
                disabled={rsvps.length === 0}
                className="px-3 py-1.5 bg-[#051a14] hover:bg-[#0d3328] disabled:opacity-40 text-[#fdfcf0] text-xs font-sans-clean rounded border border-[#c5a059]/60 flex items-center cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" />
                Экспорт CSV
              </button>

              {rsvps.length === 0 && (
                <button
                  onClick={addDemoRSVPs}
                  className="px-3 py-1.5 bg-[#051a14] hover:bg-[#0d3328] text-[#c5a059] text-xs font-sans-clean rounded border border-[#c5a059]/60 flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Заполнить демо-данными
                </button>
              )}
            </div>

            {rsvps.length > 0 && (
              <button
                onClick={clearAllRSVPs}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-200 text-xs font-sans-clean rounded border border-red-800/50 flex items-center cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Очистить
              </button>
            )}
          </div>

          {/* Guests List */}
          {rsvps.length === 0 ? (
            <div className="py-8 text-center text-[#fdfcf0]/70 font-sans-clean text-xs">
              Ответов от гостей пока нет. Заполните форму RSVP на странице или нажмите «Заполнить демо-данными».
            </div>
          ) : (
            <div className="space-y-3">
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="bg-[#051a14] border border-[#c5a059]/30 rounded-lg p-4 font-sans-clean text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm text-[#fdfcf0]">
                      {rsvp.guestName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                        rsvp.attendance === 'yes'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {rsvp.attendance === 'yes' ? 'Приедет' : 'Не смогу'}
                    </span>
                  </div>

                  {rsvp.attendance === 'yes' && (
                    <div className="text-[#fdfcf0]/80 space-y-1">
                      <div>
                        <span className="text-[#c5a059]">Напитки:</span>{' '}
                        {rsvp.drinks.length > 0 ? rsvp.drinks.join(', ') : '—'}
                      </div>
                      <div>
                        <span className="text-[#c5a059]">Трансфер:</span>{' '}
                        {rsvp.transferNeeded ? 'Да (автобус из Смоленска)' : 'Нет'}
                      </div>
                    </div>
                  )}

                  {rsvp.message && (
                    <div className="pt-1 border-t border-[#c5a059]/20 italic text-[#c5a059]">
                      «{rsvp.message}»
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
