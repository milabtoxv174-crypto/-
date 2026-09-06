import React from 'react';
import { MapPin, Bus, Car, Hotel, Sparkles, Phone, Compass } from 'lucide-react';
import { BotanicalCorner, FloralDivider, WeddingRingsFloralBadge } from './FloralDecor';
import { ParallaxBanner } from './ParallaxBanner';
import venueBannerImg from '../assets/images/c66b5c3b-fecc-46d7-816a-546f7e2dc5f5.jpg';

export const VenueHighlight: React.FC = () => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl overflow-hidden shadow-2xl relative bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />

        {/* Soft Parallax Venue Banner */}
        <ParallaxBanner
          imageSrc={venueBannerImg}
          altText="Клуб-Отель Высокое"
          speed={0.2}
          heightClass="h-72 sm:h-88"
        >
          <div className="w-full max-w-2xl text-center space-y-2">
            <span className="inline-flex items-center space-x-1.5 font-sans-clean text-xs uppercase tracking-widest text-[#ffd700] bg-[#051a14]/95 border border-[#c5a059] px-4 py-1.5 rounded-full mb-1 font-semibold">
              <Hotel className="w-3.5 h-3.5" />
              <span>Место проведения банкета</span>
            </span>
            <h3 className="font-serif-display text-3xl sm:text-5xl text-[#ffffff] font-normal drop-shadow-lg">
              Клуб-Отель «Высокое»
            </h3>
            <p className="font-sans-clean text-xs sm:text-sm text-[#fdfcf0] mt-1 flex items-center justify-center font-medium">
              <MapPin className="w-4 h-4 mr-1 text-[#ffd700] shrink-0" />
              Смоленская область, Смоленский район, д. Высокое
            </p>
          </div>
        </ParallaxBanner>

        {/* Content Details */}
        <div className="p-6 sm:p-10 space-y-6 relative">
          <WeddingRingsFloralBadge />

          <p className="font-sans-clean text-base sm:text-lg text-[#ffffff] font-normal leading-relaxed text-center max-w-2xl mx-auto">
            «Высокое» — это живописный загородный комплекс с благородным интерьером, теплыми вечерними огнями и уютной осенней атмосферой у природы.
          </p>

          <FloralDivider className="my-2" />

          {/* Grid of venue amenities & transport */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-5 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-3">
                <Bus className="w-5 h-5" />
              </div>
              <h4 className="font-sans-clean font-semibold text-sm text-[#ffffff] mb-1.5">
                Трансфер до Высокого
              </h4>
              <p className="font-sans-clean text-xs text-[#fdfcf0]/90 leading-relaxed font-normal">
                Организован трансфер от ЗАГСа в Смоленске до Клуб-Отеля «Высокое». Обратного трансфера нет.
              </p>
            </div>

            <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-5 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-3">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="font-sans-clean font-semibold text-sm text-[#ffffff] mb-1.5">
                Парковка & Проезд
              </h4>
              <p className="font-sans-clean text-xs text-[#fdfcf0]/90 leading-relaxed font-normal">
                Бесплатная парковка на территории. Гости без ночевки добираются обратно в Смоленск самостоятельно.
              </p>
            </div>

            <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-5 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0a2a22] text-[#ffd700] border border-[#c5a059] mb-3">
                <Hotel className="w-5 h-5" />
              </div>
              <h4 className="font-sans-clean font-semibold text-sm text-[#ffffff] mb-1.5">
                Домики & Номера
              </h4>
              <p className="font-sans-clean text-xs text-[#fdfcf0]/90 leading-relaxed font-normal">
                Предлагаем гостям забронировать уютные домики на территории «Высокое», чтобы с комфортом остаться на ночь.
              </p>
            </div>
          </div>

          {/* Direct Yandex Route Button */}
          <div className="text-center pt-3">
            <a
              href="https://yandex.ru/maps/?rtext=~54.831341,31.956691&rtt=auto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3.5 bg-[#051a14] hover:bg-[#0e3328] text-[#ffffff] border border-[#c5a059] hover:border-[#ffd700] rounded-lg font-sans-clean font-semibold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4 mr-2 text-[#ffd700]" />
              Построить маршрут в Яндекс.Навигаторе
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
