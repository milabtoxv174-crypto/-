import React from 'react';
import { Heart, Coffee, PhoneCall, Sparkles } from 'lucide-react';
import { BotanicalCorner, FloralDivider } from './FloralDecor';

export const LoveStory: React.FC = () => {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto">
      <div className="bg-[#0a2a22] border border-[#c5a059] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0a2a22] to-[#07201a]">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />

        {/* Header Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#051a14] border border-[#c5a059]/50 px-4 py-1.5 rounded-full text-xs font-sans-clean uppercase tracking-[2px] text-[#c5a059] mb-3">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>История любви</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#ffffff] font-normal">
            Как всё начиналось
          </h2>
          <FloralDivider className="my-3" />
        </div>

        {/* Content with crystal clear typography */}
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <p className="font-serif-display text-xl sm:text-2xl text-[#ffd700] font-normal leading-relaxed italic">
            «Говорят, судьба не звонит на рабочий телефон в ночную смену. Но наша история началась именно так.»
          </p>

          <div className="flex items-center justify-center my-4 space-x-4 text-[#c5a059]">
            <PhoneCall className="w-4 h-4" />
            <span className="w-8 h-px bg-[#c5a059]/40" />
            <Coffee className="w-4 h-4" />
            <span className="w-8 h-px bg-[#c5a059]/40" />
            <Sparkles className="w-4 h-4" />
          </div>

          <p className="font-sans-clean text-sm sm:text-base text-[#fdfcf0] leading-relaxed font-normal">
            Всё решил один неожиданный звонок с незнакомого номера. Смелая стажёрка с блока Э2, решившая просто «познакомиться и узнать, как устроена работа». Короткий ответ, удивлённые взгляды и абсолютно уверенная фраза коллеги вслед:
          </p>

          <div className="bg-[#051a14] border border-[#c5a059]/50 py-4 px-6 rounded-xl text-left font-sans-clean text-base text-[#fdfcf0] my-4 shadow-inner">
            <p className="text-[#ffd700] font-semibold">— Твоя будет.</p>
            <p className="mt-1.5 font-medium">— Да, — прозвучало в ответ.</p>
          </div>

          <p className="font-sans-clean text-sm sm:text-base text-[#fdfcf0] leading-relaxed font-normal">
            Кто бы мог подумать, что тайные встречи у кофейного автомата посреди огромного склада перерастут в самую настоящую, крепкую любовь? Теперь бумажные стаканчики с кофе сменились звоном свадебных бокалов, а рабочие графики — началом нашей счастливой семейной жизни.
          </p>

          <div className="pt-4 border-t border-[#c5a059]/40 font-serif-display text-lg sm:text-xl text-[#ffffff] font-normal">
            Мы будем счастливы разделить этот незабываемый день вместе с вами!
          </div>

          <p className="font-sans-clean text-xs uppercase tracking-[3px] text-[#c5a059] font-medium pt-1">
            30 сентября 2026 года • Клуб-Отель «Высокое»
          </p>
        </div>
      </div>
    </section>
  );
};
