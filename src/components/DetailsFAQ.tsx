import React, { useState } from 'react';
import { Gift, Wine, Phone, Copy, Check, Hash, Send } from 'lucide-react';
import { BotanicalCorner, FloralDivider } from './FloralDecor';

export const DetailsFAQ: React.FC = () => {
  const [copiedHashtag, setCopiedHashtag] = useState(false);

  const hashtag = '#ПетрИВиктория2026';

  const copyHashtag = () => {
    navigator.clipboard.writeText(hashtag);
    setCopiedHashtag(true);
    setTimeout(() => setCopiedHashtag(false), 2000);
  };

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-10 shadow-2xl relative bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />

        {/* Header Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#051a14] border border-[#c5a059]/50 px-4 py-1.5 rounded-full text-xs font-sans-clean uppercase tracking-[2px] text-[#c5a059] mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>Детали & Пожелания</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#ffffff] font-normal">
            Важные мелочи
          </h2>
          <FloralDivider className="my-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          {/* Item 1: Подарки и Цветы */}
          <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-3">
                <Wine className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-xl text-[#ffffff] font-normal mb-2">
                Подарки и цветы
              </h3>
              <p className="font-sans-clean text-sm text-[#fdfcf0]/90 leading-relaxed font-normal">
                Главный подарок для нас — ваше присутствие! Если вы хотите порадовать нас цветами, просим заменить живые букеты любимым вином, виски для нашей семейной коллекции или интересной книгой с вашим автографом.
              </p>
            </div>
            <div className="pt-4 text-xs font-sans-clean text-[#c5a059]/80 italic">
              Будем искренне благодарны за тепло и внимание
            </div>
          </div>

          {/* Item 2: Чат гостей в Telegram */}
          <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-3">
                <Send className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="font-serif-display text-xl text-[#ffffff] font-normal mb-2">
                Чат гостей в Telegram
              </h3>
              <p className="font-sans-clean text-sm text-[#fdfcf0]/90 leading-relaxed font-normal">
                Единый чат для гостей нашей свадьбы: для совместных поездок, знакомства, координации и обмена памятными фото и видео.
              </p>
            </div>

            <div className="pt-4">
              <a
                href="https://t.me/+Yskw-Adk00o5YTli"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] hover:text-[#ffffff] border border-[#c5a059] rounded-lg font-sans-clean text-xs uppercase tracking-wider font-semibold transition-all hover:scale-[1.01] shadow-sm"
              >
                <Send className="w-4 h-4 mr-2 text-sky-400" />
                <span>Присоединиться к чату</span>
              </a>
            </div>
          </div>

          {/* Item 3: Свадебный хэштег */}
          <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-3">
                <Hash className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-xl text-[#ffffff] font-normal mb-2">
                Свадебный хэштег
              </h3>
              <p className="font-sans-clean text-sm text-[#fdfcf0]/90 leading-relaxed font-normal">
                Публикуйте снимки и видео в соцсетях с нашим единым хэштегом, чтобы сохранить все радостные и трогательные моменты:
              </p>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2">
                <span className="font-sans-clean font-bold text-sm text-[#ffd700] bg-[#0a2a22] px-3.5 py-2.5 rounded-lg border border-[#c5a059] tracking-wider flex-1 text-center truncate">
                  {hashtag}
                </span>
                <button
                  onClick={copyHashtag}
                  className="px-4 py-2.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffffff] border border-[#c5a059] rounded-lg text-xs font-sans-clean font-medium transition-all flex items-center justify-center shrink-0 cursor-pointer hover:border-[#ffd700]"
                >
                  {copiedHashtag ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1 text-[#ffd700]" />
                      <span>Скопировать</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Item 4: Секреты и координация */}
          <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-xl text-[#ffffff] font-normal mb-2">
                Секреты и координация
              </h3>
              <p className="font-sans-clean text-sm text-[#fdfcf0]/90 leading-relaxed font-normal">
                Если вы готовите сюрприз или хотите уточнить детали тайминга и трансфера, напишите или позвоните нашему координатору:
              </p>
            </div>

            <div className="pt-4">
              <a
                href="tel:+79605850817"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] hover:text-[#ffffff] border border-[#c5a059] rounded-lg font-sans-clean text-xs font-semibold tracking-wide transition-all hover:scale-[1.01] shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 mr-2 text-[#c5a059]" />
                <span>Алина: +7 (960) 585-08-17</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
