import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Heart, GlassWater, Bus, UserCheck, RefreshCw } from 'lucide-react';
import { RSVPResponse } from '../types';
import { BotanicalCorner, FloralDivider } from './FloralDecor';
import { sendRsvpToGoogleSheets } from '../utils/googleSheetsSync';

interface RSVPFormProps {
  initialGuestName?: string;
  onResponseSubmitted?: (response: RSVPResponse) => void;
}

const getGuestStorageKey = (name: string) => {
  const clean = name.trim().toLowerCase();
  return clean ? `petr_viktoria_rsvp_${encodeURIComponent(clean)}` : 'petr_viktoria_anonymous_rsvp';
};

export const RSVPForm: React.FC<RSVPFormProps> = ({
  initialGuestName = '',
  onResponseSubmitted,
}) => {
  const [guestName, setGuestName] = useState(initialGuestName);
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>(['Шампанское / Игристое', 'Красное вино']);
  const [transferNeeded, setTransferNeeded] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedTicket, setSavedTicket] = useState<RSVPResponse | null>(null);

  // Check if THIS specific guest has already submitted an RSVP
  useEffect(() => {
    const targetName = initialGuestName.trim();
    setGuestName(targetName);

    // Clean up legacy global key that caused all guests to share the same answer
    try {
      localStorage.removeItem('petr_viktoria_user_rsvp');
    } catch {}

    if (targetName) {
      const key = getGuestStorageKey(targetName);
      try {
        const specificSaved = localStorage.getItem(key);
        if (specificSaved) {
          const parsed = JSON.parse(specificSaved) as RSVPResponse;
          setSavedTicket(parsed);
          setIsSubmitted(true);
          setAttendance(parsed.attendance);
          setSelectedDrinks(parsed.drinks || []);
          setTransferNeeded(parsed.transferNeeded ?? true);
          setMessage(parsed.message || '');
          return;
        }

        // Also check if this guest exists in all_rsvps master list
        const allRsvpsRaw = localStorage.getItem('petr_viktoria_all_rsvps');
        if (allRsvpsRaw) {
          const allRsvps = JSON.parse(allRsvpsRaw) as RSVPResponse[];
          const match = allRsvps.find(
            (r) => r.guestName.trim().toLowerCase() === targetName.toLowerCase()
          );
          if (match) {
            setSavedTicket(match);
            setIsSubmitted(true);
            setAttendance(match.attendance);
            setSelectedDrinks(match.drinks || []);
            setTransferNeeded(match.transferNeeded ?? true);
            setMessage(match.message || '');
            return;
          }
        }
      } catch (e) {
        console.warn('Error reading saved RSVP for guest', e);
      }

      // If this guest has NOT submitted: ensure fresh, clean, unsubmitted form!
      setIsSubmitted(false);
      setSavedTicket(null);
      setAttendance('yes');
      setSelectedDrinks(['Шампанское / Игристое', 'Красное вино']);
      setTransferNeeded(true);
      setMessage('');
      return;
    }

    // No targetName (general unpersonalized link)
    try {
      const anonSaved = localStorage.getItem('petr_viktoria_anonymous_rsvp');
      if (anonSaved) {
        const parsed = JSON.parse(anonSaved) as RSVPResponse;
        setSavedTicket(parsed);
        setIsSubmitted(true);
        setAttendance(parsed.attendance);
        setSelectedDrinks(parsed.drinks || []);
        setTransferNeeded(parsed.transferNeeded ?? true);
        setMessage(parsed.message || '');
        return;
      }
    } catch {}

    setIsSubmitted(false);
    setSavedTicket(null);
    setAttendance('yes');
    setSelectedDrinks(['Шампанское / Игристое', 'Красное вино']);
    setTransferNeeded(true);
    setMessage('');
  }, [initialGuestName]);

  const drinkOptions = [
    'Шампанское / Игристое',
    'Красное вино',
    'Белое вино',
    'Виски',
    'Водка',
    'Безалкогольные напитки / Соки',
  ];

  const handleDrinkToggle = (drink: string) => {
    if (selectedDrinks.includes(drink)) {
      setSelectedDrinks(selectedDrinks.filter((d) => d !== drink));
    } else {
      setSelectedDrinks([...selectedDrinks, drink]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);

    const rsvp: RSVPResponse = {
      id: savedTicket?.id || Date.now().toString(),
      guestName: guestName.trim(),
      attendance,
      drinks: attendance === 'yes' ? selectedDrinks : [],
      transferNeeded: attendance === 'yes' ? transferNeeded : false,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      // Save specifically for this guest
      const specificKey = getGuestStorageKey(rsvp.guestName);
      localStorage.setItem(specificKey, JSON.stringify(rsvp));
      localStorage.removeItem('petr_viktoria_user_rsvp');

      const allRsvpsRaw = localStorage.getItem('petr_viktoria_all_rsvps');
      const allRsvps: RSVPResponse[] = allRsvpsRaw ? JSON.parse(allRsvpsRaw) : [];
      const updatedList = [
        rsvp,
        ...allRsvps.filter((r) => r.guestName.trim().toLowerCase() !== rsvp.guestName.trim().toLowerCase()),
      ];
      localStorage.setItem('petr_viktoria_all_rsvps', JSON.stringify(updatedList));
    } catch (err) {
      console.warn("Storage save error", err);
    }

    try {
      await sendRsvpToGoogleSheets(rsvp);
    } catch (err) {
      console.warn("Google Sheets send error", err);
    }

    setIsSubmitting(false);
    setSavedTicket(rsvp);
    setIsSubmitted(true);

    if (onResponseSubmitted) {
      onResponseSubmitted(rsvp);
    }
  };

  return (
    <section id="rsvp" className="py-16 px-4 max-w-3xl mx-auto scroll-mt-6">
      <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-10 shadow-2xl relative bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#051a14] border border-[#c5a059]/50 px-4 py-1.5 rounded-full text-xs font-sans-clean uppercase tracking-[2px] text-[#c5a059] mb-3 font-semibold">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>RSVP / Подтверждение</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#ffffff] font-normal">
            Примите ли вы наше приглашение?
          </h2>
          <FloralDivider className="my-3" />
          <p className="font-sans-clean text-sm text-[#fdfcf0]/90 mt-1 max-w-md mx-auto font-normal">
            Пожалуйста, подтвердите ваше участие до 10 сентября 2026 года, чтобы мы могли комфортно спланировать банкет.
          </p>
        </div>

        {isSubmitted && savedTicket ? (
          /* Confirmation Ticket View */
          <div className="bg-[#051a14] border border-[#c5a059] rounded-xl p-6 sm:p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-1">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="font-sans-clean text-xs uppercase tracking-widest text-[#ffd700] font-semibold">
                Ваш ответ принят!
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#ffffff] font-normal mt-1">
                {savedTicket.guestName}
              </h3>
            </div>

            <div className="p-5 bg-[#0a2a22] border border-[#c5a059]/50 rounded-xl text-left space-y-3 font-sans-clean text-sm">
              <div className="flex justify-between items-center border-b border-[#c5a059]/30 pb-2.5">
                <span className="text-[#fdfcf0]/80">Статус присутствия:</span>
                <span className="font-semibold text-[#ffd700]">
                  {savedTicket.attendance === 'yes'
                    ? 'С удовольствием приду'
                    : savedTicket.attendance === 'no'
                    ? 'К сожалению, не смогу'
                    : 'Пока не уверен(а)'}
                </span>
              </div>

              {savedTicket.attendance === 'yes' && (
                <>
                  <div className="flex justify-between items-start border-b border-[#c5a059]/30 pb-2.5">
                    <span className="text-[#fdfcf0]/80">Предпочтения по напиткам:</span>
                    <span className="font-medium text-[#ffffff] text-right">
                      {savedTicket.drinks.length > 0 ? savedTicket.drinks.join(', ') : 'Не указаны'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#c5a059]/30 pb-2.5">
                    <span className="text-[#fdfcf0]/80">Трансфер до Высокого:</span>
                    <span className="font-medium text-[#ffffff]">
                      {savedTicket.transferNeeded ? 'Да (от ЗАГСа)' : 'Нет, на своем транспорте'}
                    </span>
                  </div>
                </>
              )}

              {savedTicket.message && (
                <div className="pt-1">
                  <span className="text-[#fdfcf0]/80 block mb-1">Ваше пожелание:</span>
                  <p className="font-sans-clean text-sm text-[#ffd700] italic">
                    «{savedTicket.message}»
                  </p>
                </div>
              )}
            </div>

            <p className="font-sans-clean text-[#ffd700] text-sm font-medium">
              Спасибо! С нетерпением ждем встречи с вами 30 сентября 2026 года!
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffffff] text-xs font-sans-clean font-semibold rounded-lg border border-[#c5a059] transition-colors cursor-pointer"
              >
                Изменить ответ
              </button>
            </div>
          </div>
        ) : (
          /* Interactive RSVP Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Name */}
            <div>
              <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#c5a059] mb-2">
                Ваше имя и фамилия *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Иван Петров или Иван и Мария"
                className="w-full bg-[#051a14] border-2 border-[#1d5844] focus:border-[#c5a059] rounded-lg px-4 py-3 text-sm text-[#ffffff] placeholder-[#669080] focus:outline-none transition-all font-sans-clean"
              />
            </div>

            {/* Attendance Radios */}
            <div>
              <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#c5a059] mb-2">
                Сможете ли вы присутствовать?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('yes')}
                  className={`p-3.5 rounded-lg border text-xs font-sans-clean font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    attendance === 'yes'
                      ? 'bg-[#c5a059] border-[#e8ca8c] text-[#051a14] shadow-lg scale-[1.02]'
                      : 'bg-[#051a14] border-[#c5a059]/40 text-[#fdfcf0] hover:border-[#c5a059]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  <span>С удовольствием приду</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('no')}
                  className={`p-3.5 rounded-lg border text-xs font-sans-clean font-medium transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    attendance === 'no'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-md'
                      : 'bg-[#051a14] border-[#c5a059]/40 text-[#fdfcf0]/80 hover:border-rose-400/50'
                  }`}
                >
                  <span>К сожалению, не смогу</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('maybe')}
                  className={`p-3.5 rounded-lg border text-xs font-sans-clean font-medium transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    attendance === 'maybe'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-100 shadow-md'
                      : 'bg-[#051a14] border-[#c5a059]/40 text-[#fdfcf0]/80 hover:border-amber-400/50'
                  }`}
                >
                  <span>Сообщу позже</span>
                </button>
              </div>
            </div>

            {/* Drink preferences (only if attending) */}
            {attendance === 'yes' && (
              <>
                <div className="pt-3 border-t border-[#c5a059]/30">
                  <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#c5a059] mb-2 flex items-center">
                    <GlassWater className="w-3.5 h-3.5 mr-1.5 text-[#ffd700]" />
                    Ваши предпочтения по напиткам
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {drinkOptions.map((drink) => {
                      const isSelected = selectedDrinks.includes(drink);
                      return (
                        <button
                          key={drink}
                          type="button"
                          onClick={() => handleDrinkToggle(drink)}
                          className={`p-3 rounded-lg border text-xs font-sans-clean font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#0a2a22] border-[#ffd700] text-[#ffffff]'
                              : 'bg-[#051a14] border-[#c5a059]/40 text-[#fdfcf0]/80 hover:border-[#c5a059]'
                          }`}
                        >
                          <span>{drink}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'bg-[#ffd700] border-[#ffd700] text-[#051a14] font-bold'
                                : 'border-[#c5a059]/50'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Transfer Checkbox */}
                <div className="pt-3 border-t border-[#c5a059]/30">
                  <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#c5a059] mb-2 flex items-center">
                    <Bus className="w-3.5 h-3.5 mr-1.5 text-[#ffd700]" />
                    Трансфер до Высокого
                  </label>
                  <div
                    onClick={() => setTransferNeeded(!transferNeeded)}
                    className="bg-[#051a14] border border-[#c5a059]/50 hover:border-[#ffd700] rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="pr-4">
                      <span className="font-sans-clean text-sm font-semibold text-[#ffffff] block">
                        Мне нужен трансфер от ЗАГСа до Клуб-Отеля «Высокое»
                      </span>
                      <span className="font-sans-clean text-xs text-[#fdfcf0]/80">
                        Организован трансфер только до площадки. Обратного трансфера нет (можно забронировать домик или доехать самостоятельно)
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        transferNeeded
                          ? 'bg-[#ffd700] border-[#ffd700] text-[#051a14]'
                          : 'border-[#c5a059]/50'
                      }`}
                    >
                      {transferNeeded && <span className="font-bold text-xs">✓</span>}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Message/Wish */}
            <div className="pt-3 border-t border-[#c5a059]/30">
              <label className="block font-sans-clean text-xs font-semibold uppercase tracking-wider text-[#c5a059] mb-2">
                Пожелания или примечания для молодоженов
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ваши тёплые слова, любимые песни или пищевые ограничения..."
                className="w-full bg-[#051a14] border-2 border-[#1d5844] focus:border-[#c5a059] rounded-lg px-4 py-3 text-sm text-[#ffffff] placeholder-[#669080] focus:outline-none transition-all resize-none font-sans-clean font-normal"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#c5a059] hover:bg-[#d8b46e] text-[#051a14] font-sans-clean font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                  <span>Сохранение и отправка...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  <span>Отправить ответ (RSVP)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
