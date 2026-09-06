import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Download, ExternalLink } from 'lucide-react';
import { generateICSFile, getGoogleCalendarLink } from '../utils/calendar';
import { FloralDivider } from './FloralDecor';

const WEDDING_TIMESTAMP = new Date('2026-09-30T15:00:00+03:00').getTime();

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const difference = WEDDING_TIMESTAMP - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center space-x-2 bg-[#0a2a22] border border-[#c5a059]/50 px-4 py-1.5 rounded-full text-xs font-sans-clean uppercase tracking-[2px] text-[#c5a059] mb-3">
        <Clock className="w-3.5 h-3.5" />
        <span>До торжества осталось</span>
      </div>

      <h2 className="font-serif-display text-3xl sm:text-4xl text-[#ffffff] font-normal">
        Обратный отсчёт
      </h2>
      <FloralDivider className="my-3" />

      {/* Countdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-2xl mx-auto">
        <div className="bg-[#0a2a22] border-2 border-[#c5a059]/60 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden group hover:border-[#c5a059] transition-all">
          <div className="font-serif-display text-4xl sm:text-5xl font-bold text-[#ffd700] mb-1 drop-shadow-sm">
            {timeLeft.days}
          </div>
          <div className="font-sans-clean text-xs text-[#fdfcf0] uppercase tracking-wider font-semibold">
            Дней
          </div>
        </div>

        <div className="bg-[#0a2a22] border-2 border-[#c5a059]/60 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden group hover:border-[#c5a059] transition-all">
          <div className="font-serif-display text-4xl sm:text-5xl font-bold text-[#ffd700] mb-1 drop-shadow-sm">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="font-sans-clean text-xs text-[#fdfcf0] uppercase tracking-wider font-semibold">
            Часов
          </div>
        </div>

        <div className="bg-[#0a2a22] border-2 border-[#c5a059]/60 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden group hover:border-[#c5a059] transition-all">
          <div className="font-serif-display text-4xl sm:text-5xl font-bold text-[#ffd700] mb-1 drop-shadow-sm">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="font-sans-clean text-xs text-[#fdfcf0] uppercase tracking-wider font-semibold">
            Минут
          </div>
        </div>

        <div className="bg-[#0a2a22] border-2 border-[#c5a059]/60 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden group hover:border-[#c5a059] transition-all">
          <div className="font-serif-display text-4xl sm:text-5xl font-bold text-[#ffd700] mb-1 drop-shadow-sm">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="font-sans-clean text-xs text-[#fdfcf0] uppercase tracking-wider font-semibold">
            Секунд
          </div>
        </div>
      </div>

      {/* Calendar Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={generateICSFile}
          className="inline-flex items-center px-5 py-3 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffffff] border border-[#c5a059] hover:border-[#ffd700] rounded-lg text-xs font-sans-clean font-semibold tracking-wider transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
        >
          <Download className="w-4 h-4 mr-2 text-[#ffd700]" />
          Сохранить в календарь (.ics)
        </button>

        <a
          href={getGoogleCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-3 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffffff] border border-[#c5a059] hover:border-[#ffd700] rounded-lg text-xs font-sans-clean font-semibold tracking-wider transition-all shadow-md hover:scale-105 active:scale-95"
        >
          <Calendar className="w-4 h-4 mr-2 text-[#ffd700]" />
          Добавить в Google Календарь
          <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
        </a>
      </div>
    </section>
  );
};
