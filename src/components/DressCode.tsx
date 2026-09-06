import React from 'react';
import { Shirt, Sparkles, Heart } from 'lucide-react';
import { BotanicalCorner, FloralDivider } from './FloralDecor';

const WEDDING_PALETTE = [
  { hex: '#4a2c1d', name: 'Шоколадный' },
  { hex: '#b35d38', name: 'Тёплая терракота' },
  { hex: '#c87d3a', name: 'Карамель / Мокко' },
  { hex: '#c5a059', name: 'Пыльное золото' },
  { hex: '#581825', name: 'Марсала / Бордо' },
  { hex: '#d4b996', name: 'Тёплый кашемир' },
];

export const DressCode: React.FC = () => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-[#0a2a22] border border-[#c5a059] rounded-xl p-6 sm:p-10 shadow-2xl relative">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />

        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#051a14] border border-[#c5a059]/40 px-4 py-1.5 rounded-full text-xs font-sans-clean uppercase tracking-[2px] text-[#c5a059] mb-3">
            <Shirt className="w-3.5 h-3.5" />
            <span>Дресс-код</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#fdfcf0] font-normal">
            Палитра торжества
          </h2>
          <FloralDivider className="my-3" />
        </div>

        {/* Concept text - simple, concise, clear */}
        <p className="font-sans-clean text-sm sm:text-base text-[#fdfcf0]/90 text-center max-w-2xl mx-auto leading-relaxed mb-8">
          Будем искренне рады, если в выборе нарядов вы поддержите тёплые благородные оттенки осенней палитры:
        </p>

        {/* Concise Color Swatches Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {WEDDING_PALETTE.map((color, idx) => (
            <div
              key={idx}
              className="bg-[#051a14] border border-[#c5a059]/30 rounded-xl p-3 text-center flex flex-col items-center hover:border-[#c5a059] transition-all group shadow-sm"
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#c5a059]/60 shadow-md mb-2 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: color.hex }}
              />
              <span className="font-sans-clean text-xs font-medium text-[#fdfcf0] leading-tight">
                {color.name}
              </span>
            </div>
          ))}
        </div>

        {/* Concise Recommendations for Ladies & Gentlemen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#051a14]/90 border border-[#c5a059]/40 rounded-lg p-5">
            <h3 className="font-serif-display text-lg text-[#c5a059] font-medium mb-1.5 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-[#c5a059]" />
              Для прекрасных дам
            </h3>
            <p className="font-sans-clean text-xs sm:text-sm text-[#fdfcf0]/85 leading-relaxed">
              Вечерние или коктейльные платья, элегантные костюмы в тёплых оттенках палитры. Пожалуйста, воздержитесь от белого цвета — оставьте его для невесты.
            </p>
          </div>

          <div className="bg-[#051a14]/90 border border-[#c5a059]/40 rounded-lg p-5">
            <h3 className="font-serif-display text-lg text-[#c5a059] font-medium mb-1.5 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-[#c5a059]" />
              Для джентльменов
            </h3>
            <p className="font-sans-clean text-xs sm:text-sm text-[#fdfcf0]/85 leading-relaxed">
              Классические костюмы (шоколадный, графитовый, чёрный или тёплые оттенки палитры), смокинги с рубашкой и галстуком/бабочкой. Пожалуйста, <span className="text-[#e5c158] font-medium">воздержитесь от синих и тёмно-синих костюмов</span> — этот цвет выбран для жениха. <span className="text-[#e5c158] font-medium">Пожелание:</span> отдавайте предпочтение классическому приталенному или прямому крою (без оверсайз фасонов).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
