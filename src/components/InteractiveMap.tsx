import React, { useState } from 'react';
import { MapPin, ExternalLink, Map } from 'lucide-react';
import { BotanicalCorner, FloralDivider } from './FloralDecor';

interface LocationPoint {
  id: string;
  name: string;
  title: string;
  address: string;
  yandexUrl: string;
  gisUrl: string;
  embedSrc: string;
  time: string;
  description: string;
}

const LOCATIONS: LocationPoint[] = [
  {
    id: 'vysokoe',
    name: 'Клуб-Отель «Высокое»',
    title: 'Велком-зона и банкет',
    address: 'Смоленская область, пос. Высокое, ул. Центральная, 1',
    yandexUrl: 'https://yandex.ru/maps/?text=Клуб-Отель+Высокое+Смоленск',
    gisUrl: 'https://2gis.ru/smolensk/search/Клуб-Отель%20Высокое',
    embedSrc: 'https://yandex.ru/map-widget/v1/?ll=32.124500%2C54.762000&z=13&pt=32.124500%2C54.762000',
    time: '16:00 / 17:00',
    description: 'Живописная загородная площадка: сбор гостей и велком в 16:00, праздничный банкет в 17:00.',
  },
  {
    id: 'zags',
    name: 'Дворец Бракосочетания (ЗАГС)',
    title: 'Официальная роспись',
    address: 'г. Смоленск, ул. Глинки, д. 4',
    yandexUrl: 'https://yandex.ru/maps/?text=Смоленск+ул.+Глинки+4+ЗАГС',
    gisUrl: 'https://2gis.ru/smolensk/search/Смоленск%20ул.%20Глинки%204',
    embedSrc: 'https://yandex.ru/map-widget/v1/?ll=32.048900%2C54.781200&z=15&pt=32.048900%2C54.781200',
    time: '15:00',
    description: 'Торжественная церемония бракосочетания в историческом центре Смоленска.',
  },
];

export const InteractiveMap: React.FC = () => {
  const [activeLoc, setActiveLoc] = useState<LocationPoint>(LOCATIONS[0]);

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-10 shadow-2xl relative bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />

        {/* Header Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#051a14] border border-[#c5a059]/50 px-4 py-1.5 rounded-full text-xs font-sans-clean uppercase tracking-[2px] text-[#c5a059] mb-3 font-semibold">
            <Map className="w-3.5 h-3.5" />
            <span>Интерактивная карта</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#ffffff] font-normal">
            Как добраться
          </h2>
          <FloralDivider className="my-3" />
        </div>

        {/* Location Toggle Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActiveLoc(loc)}
              className={`px-5 py-2.5 rounded-xl font-sans-clean text-xs uppercase tracking-wider font-semibold transition-all flex items-center cursor-pointer shadow-md ${
                activeLoc.id === loc.id
                  ? 'bg-[#c5a059] text-[#051a14] scale-105 border border-[#ffd700]'
                  : 'bg-[#051a14] text-[#ffffff] border border-[#c5a059]/50 hover:border-[#c5a059]'
              }`}
            >
              <MapPin className="w-4 h-4 mr-1.5" />
              {loc.name}
            </button>
          ))}
        </div>

        {/* Active Location Info Box */}
        <div className="bg-[#051a14] border border-[#c5a059]/50 rounded-xl p-5 mb-6 space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-sans-clean text-xs uppercase tracking-widest text-[#ffd700] font-semibold">
                {activeLoc.title} • {activeLoc.time}
              </span>
              <h3 className="font-serif-display text-2xl text-[#ffffff] font-normal mt-0.5">
                {activeLoc.name}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={activeLoc.yandexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] border border-[#c5a059] rounded-lg text-xs font-sans-clean font-medium transition-all flex items-center shadow-sm"
              >
                Яндекс.Карты <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a
                href={activeLoc.gisUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#0a2a22] hover:bg-[#113a30] text-[#fdfcf0] border border-[#c5a059]/60 rounded-lg text-xs font-sans-clean transition-all flex items-center"
              >
                2ГИС <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          <p className="font-sans-clean text-sm text-[#ffd700] font-medium">
            {activeLoc.address}
          </p>
          <p className="font-sans-clean text-xs sm:text-sm text-[#fdfcf0]/90 leading-relaxed font-normal">
            {activeLoc.description}
          </p>
        </div>

        {/* Interactive Map Embed Container */}
        <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-[#c5a059]/60 shadow-xl bg-[#051a14]">
          <iframe
            title={activeLoc.name}
            src={activeLoc.embedSrc}
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full h-full filter contrast-105 brightness-95"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
