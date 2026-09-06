import React, { useState } from 'react';
import { MapPin, Clock, Copy, Check, ExternalLink, Heart, GlassWater, Navigation, Sparkles, Moon, Bus, Home } from 'lucide-react';
import { BotanicalCorner, FloralDivider } from './FloralDecor';

export const ScheduleTimeline: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  return (
    <section id="schedule" className="py-14 px-4 max-w-4xl mx-auto scroll-mt-6">
      <div className="text-center mb-10">
        <span className="font-sans-clean text-xs uppercase tracking-[3px] text-[#c5a059] bg-[#0a2a22] border border-[#c5a059]/50 px-4 py-1.5 rounded-full inline-block mb-3 font-semibold">
          Программа торжества
        </span>
        <h2 className="font-serif-display text-3xl sm:text-5xl text-[#ffffff] font-normal">
          30 сентября 2026 года
        </h2>
        <FloralDivider className="my-3" />
      </div>

      {/* Timeline Items Container */}
      <div className="relative space-y-8 sm:space-y-12 before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-ml-px before:w-0.5 before:bg-[#c5a059]">
        
        {/* Item 1: 15:00 - Торжественная роспись */}
        <div className="relative flex flex-col sm:flex-row items-start group">
          {/* Timeline Icon Badge */}
          <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-[#051a14] border-2 border-[#c5a059] text-[#ffd700] shadow-xl">
            <Heart className="w-5 h-5 fill-current" />
          </div>

          {/* Time & Card Content */}
          <div className="ml-12 sm:ml-0 sm:w-1/2 sm:pr-10 sm:text-right w-full mb-4 sm:mb-0">
            <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-7 shadow-2xl relative group-hover:border-[#ffd700] transition-all bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
              <div className="inline-flex items-center space-x-1.5 font-sans-clean text-xs uppercase tracking-widest text-[#ffd700] mb-2 bg-[#051a14] px-3.5 py-1 rounded-full border border-[#c5a059]/60 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>15:00</span>
              </div>

              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#ffffff] font-normal mt-1 mb-2">
                Торжественная роспись
              </h3>

              <div className="font-sans-clean text-sm text-[#ffd700] font-semibold mb-1">
                Дворец бракосочетания
              </div>

              <div className="font-sans-clean text-xs text-[#fdfcf0]/90 mb-4 flex items-center sm:justify-end gap-1 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                <span>г. Смоленск, ул. Глинки, д. 4</span>
              </div>

              <p className="font-sans-clean text-sm text-[#fdfcf0] leading-relaxed mb-5 font-normal">
                Официальная церемония регистрации брака. Просим гостей собраться за 15 минут до начала (в 14:45).
              </p>

              {/* Action Links */}
              <div className="flex flex-wrap items-center sm:justify-end gap-2 pt-3 border-t border-[#c5a059]/40">
                <button
                  onClick={() => copyToClipboard('г. Смоленск, ул. Глинки, д. 4', 'zags')}
                  className="px-3.5 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#ffd700] text-xs font-sans-clean font-medium rounded-lg border border-[#c5a059] flex items-center cursor-pointer transition-colors"
                >
                  {copiedAddress === 'zags' ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      <span>Скопировать адрес</span>
                    </>
                  )}
                </button>

                <a
                  href="https://yandex.ru/maps/?text=Смоленск+улица+Глинки+4+Дворец+бракосочетания"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#ffffff] text-xs font-sans-clean font-medium rounded-lg border border-[#c5a059] flex items-center transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1 text-[#ffd700]" />
                  <span>Яндекс.Карты</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </a>

                <a
                  href="https://2gis.ru/smolensk/search/Смоленск%20улица%20Глинки%204"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#fdfcf0] text-xs font-sans-clean rounded-lg border border-[#c5a059]/60 flex items-center transition-colors"
                >
                  <span>2ГИС</span>
                </a>
              </div>
            </div>
          </div>

          <div className="hidden sm:block sm:w-1/2" />
        </div>

        {/* Item 2: 16:00 - Велком-зона */}
        <div className="relative flex flex-col sm:flex-row items-start group">
          {/* Timeline Icon Badge */}
          <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-[#051a14] border-2 border-[#c5a059] text-[#ffd700] shadow-xl">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>

          <div className="hidden sm:block sm:w-1/2" />

          {/* Time & Card Content */}
          <div className="ml-12 sm:ml-0 sm:w-1/2 sm:pl-10 w-full mb-4 sm:mb-0">
            <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-7 shadow-2xl relative group-hover:border-[#ffd700] transition-all bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
              <div className="inline-flex items-center space-x-1.5 font-sans-clean text-xs uppercase tracking-widest text-[#ffd700] mb-2 bg-[#051a14] px-3.5 py-1 rounded-full border border-[#c5a059]/60 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>16:00</span>
              </div>

              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#ffffff] font-normal mt-1 mb-2">
                Велком-зона
              </h3>

              <div className="font-sans-clean text-sm text-[#ffd700] font-semibold mb-1">
                Клуб-Отель «Высокое»
              </div>

              <div className="font-sans-clean text-xs text-[#fdfcf0]/90 mb-4 flex items-center gap-1 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                <span>Смоленская область, пос. Высокое, ул. Центральная, 1</span>
              </div>

              <p className="font-sans-clean text-sm text-[#fdfcf0] leading-relaxed mb-5 font-normal">
                Сбор гостей на загородной площадке, приветственный аперитив, легкие закуски, приятная музыка, фотосессия и непринужденное общение.
              </p>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#c5a059]/40">
                <button
                  onClick={() => copyToClipboard('Смоленская область, пос. Высокое, ул. Центральная, 1, Клуб-Отель Высокое', 'welcome-vysokoe')}
                  className="px-3.5 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#ffd700] text-xs font-sans-clean font-medium rounded-lg border border-[#c5a059] flex items-center cursor-pointer transition-colors"
                >
                  {copiedAddress === 'welcome-vysokoe' ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      <span>Скопировать адрес</span>
                    </>
                  )}
                </button>

                <a
                  href="https://yandex.ru/maps/?text=Клуб-Отель+Высокое+Смоленский+район+деревня+Высокое"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#ffffff] text-xs font-sans-clean font-medium rounded-lg border border-[#c5a059] flex items-center transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1 text-[#ffd700]" />
                  <span>Яндекс.Карты</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </a>

                <a
                  href="https://2gis.ru/smolensk/search/Клуб-Отель%20Высокое"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#fdfcf0] text-xs font-sans-clean rounded-lg border border-[#c5a059]/60 flex items-center transition-colors"
                >
                  <span>2ГИС</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Item 3: 17:00 - Праздничный банкет */}
        <div className="relative flex flex-col sm:flex-row items-start group">
          {/* Timeline Icon Badge */}
          <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-[#051a14] border-2 border-[#c5a059] text-[#ffd700] shadow-xl">
            <GlassWater className="w-5 h-5 fill-current" />
          </div>

          {/* Time & Card Content (Left side) */}
          <div className="ml-12 sm:ml-0 sm:w-1/2 sm:pr-10 sm:text-right w-full">
            <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-7 shadow-2xl relative group-hover:border-[#ffd700] transition-all bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
              <div className="inline-flex items-center space-x-1.5 font-sans-clean text-xs uppercase tracking-widest text-[#ffd700] mb-2 bg-[#051a14] px-3.5 py-1 rounded-full border border-[#c5a059]/60 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>17:00</span>
              </div>

              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#ffffff] font-normal mt-1 mb-2">
                Праздничный банкет
              </h3>

              <div className="font-sans-clean text-sm text-[#ffd700] font-semibold mb-1">
                Клуб-Отель «Высокое»
              </div>

              <div className="font-sans-clean text-xs text-[#fdfcf0]/90 mb-4 flex items-center sm:justify-end gap-1 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                <span>Смоленская область, пос. Высокое, ул. Центральная, 1</span>
              </div>

              <p className="font-sans-clean text-sm text-[#fdfcf0] leading-relaxed mb-5 font-normal">
                Торжественный свадебный ужин, теплые тосты, праздничная шоу-программа, танцы и разрезание торта.
              </p>

              {/* Action Links */}
              <div className="flex flex-wrap items-center sm:justify-end gap-2 pt-3 border-t border-[#c5a059]/40">
                <button
                  onClick={() => copyToClipboard('Смоленская область, пос. Высокое, ул. Центральная, 1, Клуб-Отель Высокое', 'vysokoe')}
                  className="px-3.5 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#ffd700] text-xs font-sans-clean font-medium rounded-lg border border-[#c5a059] flex items-center cursor-pointer transition-colors"
                >
                  {copiedAddress === 'vysokoe' ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      <span>Скопировать адрес</span>
                    </>
                  )}
                </button>

                <a
                  href="https://yandex.ru/maps/?text=Клуб-Отель+Высокое+Смоленский+район+деревня+Высокое"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#ffffff] text-xs font-sans-clean font-medium rounded-lg border border-[#c5a059] flex items-center transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1 text-[#ffd700]" />
                  <span>Яндекс.Карты</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </a>

                <a
                  href="https://2gis.ru/smolensk/search/Клуб-Отель%20Высокое"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#051a14] hover:bg-[#0d3329] text-[#fdfcf0] text-xs font-sans-clean rounded-lg border border-[#c5a059]/60 flex items-center transition-colors"
                >
                  <span>2ГИС</span>
                </a>
              </div>
            </div>
          </div>

          <div className="hidden sm:block sm:w-1/2" />
        </div>

        {/* Item 4: 23:00 - Окончание вечера */}
        <div className="relative flex flex-col sm:flex-row items-start group">
          {/* Timeline Icon Badge */}
          <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-[#051a14] border-2 border-[#c5a059] text-[#ffd700] shadow-xl">
            <Moon className="w-5 h-5 fill-current" />
          </div>

          <div className="hidden sm:block sm:w-1/2" />

          {/* Time & Card Content (Right side) */}
          <div className="ml-12 sm:ml-0 sm:w-1/2 sm:pl-10 w-full">
            <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-7 shadow-2xl relative group-hover:border-[#ffd700] transition-all bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
              <div className="inline-flex items-center space-x-1.5 font-sans-clean text-xs uppercase tracking-widest text-[#ffd700] mb-2 bg-[#051a14] px-3.5 py-1 rounded-full border border-[#c5a059]/60 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>23:00</span>
              </div>

              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#ffffff] font-normal mt-1 mb-2">
                Окончание вечера
              </h3>

              <div className="font-sans-clean text-sm text-[#ffd700] font-semibold mb-1">
                Клуб-Отель «Высокое»
              </div>

              <div className="font-sans-clean text-xs text-[#fdfcf0]/90 mb-4 flex items-center gap-1 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                <span>Смоленская область, пос. Высокое, ул. Центральная, 1</span>
              </div>

              <p className="font-sans-clean text-sm text-[#fdfcf0] leading-relaxed mb-4 font-normal">
                Завершение праздничного банкета, яркий финал вечера и теплые проводы молодоженов.
              </p>

              <div className="flex items-start gap-2 pt-3 border-t border-[#c5a059]/40 text-xs font-sans-clean text-[#ffd700]">
                <Home className="w-4 h-4 shrink-0 text-[#ffd700] mt-0.5" />
                <span className="text-[#fdfcf0]/90">
                  Обратный трансфер не предусмотрен: гости могут остаться на ночь, заранее забронировав уютные домики в Клуб-Отеле «Высокое», либо самостоятельно добраться до Смоленска.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
