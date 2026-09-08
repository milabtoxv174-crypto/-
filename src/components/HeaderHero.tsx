import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Calendar, MapPin, Heart, Disc, Music } from 'lucide-react';
import { weddingAudioPlayer, PlayerState } from '../utils/audio';
import { BotanicalCorner, FloralDivider, BotanicalWreathBadge } from './FloralDecor';
import { formatGuestSalutation } from '../utils/greeting';
import heroCouplePhoto from '../assets/images/fbb441c5-19e5-4b2d-b923-749f4beffe6e.jpg';

interface HeaderHeroProps {
  guestName: string;
  setGuestName?: (name: string) => void;
  isPlayingMusic?: boolean;
  onToggleMusic: () => void;
  isLeavesActive: boolean;
  onToggleLeaves: () => void;
  onScrollToRSVP: () => void;
  onScrollToSchedule: () => void;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({
  guestName,
  setGuestName: _unusedSetGuestName,
  isPlayingMusic: _unused,
  onToggleMusic,
  isLeavesActive,
  onToggleLeaves,
  onScrollToRSVP,
  onScrollToSchedule,
}) => {
  const [playerState, setPlayerState] = useState<PlayerState>(weddingAudioPlayer.getState());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const unsubscribe = weddingAudioPlayer.subscribe((state) => {
      setPlayerState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="relative w-full overflow-hidden pt-8 pb-16 px-4 text-center border-b border-[#c5a059]/30">
      {/* Sophisticated Dot Background Layer */}
      <div className="absolute inset-0 z-0 sophisticated-dot-bg opacity-15 pointer-events-none" />
      
      {/* Background Image Ambient Glow with Parallax Translation */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * 0.25}px, 0)`,
        }}
      >
        <img
          src={heroCouplePhoto}
          alt="Pyotr & Viktoria Wedding Portrait"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-[120%] object-cover opacity-25 filter blur-[1.5px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#051a14]/90 via-[#0a2a22]/95 to-[#051a14]" />
      </div>

      {/* Floating Control Badges */}
      <div className="relative z-20 max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-2 mb-6 px-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMusic}
            className={`flex items-center space-x-2 text-xs py-2 px-4 rounded-full border transition-all cursor-pointer shadow-md ${
              playerState.isPlaying
                ? 'bg-[#c5a059] border-[#e8ca8c] text-[#051a14] font-semibold'
                : 'bg-[#0a2a22]/95 border-[#c5a059]/60 text-[#fdfcf0] hover:text-[#ffd700] hover:border-[#c5a059]'
            }`}
            title="Включить / Выключить музыку: Lana Del Rey — Young and Beautiful"
          >
            <div
              className={`w-4 h-4 rounded-full bg-black border border-[#c5a059] flex items-center justify-center ${
                playerState.isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <Disc className="w-2.5 h-2.5 text-[#c5a059]" />
            </div>
            <span className="font-sans-clean tracking-wide uppercase text-xs">
              {playerState.isPlaying
                ? '♪ Lana Del Rey — Young and Beautiful'
                : '▶ Музыка: Young and Beautiful'}
            </span>
          </button>

          <button
            onClick={onToggleLeaves}
            className={`flex items-center space-x-1.5 text-xs py-2 px-3.5 rounded-full border transition-all cursor-pointer ${
              isLeavesActive
                ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#fdfcf0]'
                : 'bg-[#0a2a22]/95 border-[#1c5341] text-[#a2c2b5] hover:border-[#c5a059]/50'
            }`}
            title="Осенний листопад"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="font-sans-clean text-xs hidden sm:inline">Листопад</span>
          </button>
        </div>

        <div className="flex items-center text-xs text-[#c5a059] font-sans-clean font-semibold tracking-widest uppercase bg-[#0a2a22]/95 border border-[#c5a059]/50 px-3.5 py-2 rounded-full shadow-sm">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>30.09.2026</span>
        </div>
      </div>

      {/* Main Card Frame with Double Gold Border Theme and Botanical Corners */}
      <div className="relative z-10 max-w-2xl mx-auto bg-[#0a2a22] border border-[#c5a059] p-2 sm:p-3 rounded-2xl shadow-2xl">
        <BotanicalCorner position="top-left" />
        <BotanicalCorner position="top-right" />
        <BotanicalCorner position="bottom-left" />
        <BotanicalCorner position="bottom-right" />

        <div className="border border-[#c5a059] rounded-xl p-6 sm:p-10 flex flex-col items-center relative bg-gradient-to-b from-[#0a2a22] to-[#07201a]">

          {/* Top Eyebrow Tag */}
          <p className="uppercase tracking-[3px] text-xs font-sans-clean font-semibold text-[#c5a059] mb-2">
            ПРИГЛАШЕНИЕ НА СВАДЬБУ
          </p>

          {/* Botanical Floral Wreath with Couple Monogram */}
          <BotanicalWreathBadge sizeClass="w-44 h-44 sm:w-52 sm:h-52">
            <div className="text-center flex flex-col items-center justify-center">
              <div className="font-royal-cormorant text-3xl sm:text-4xl text-[#ffd700] font-bold tracking-widest leading-none drop-shadow-md flex items-center justify-center space-x-1.5">
                <span className="text-[#fdfcf0]">П</span>
                <span className="font-serif-display text-xl sm:text-2xl text-[#ffd700] font-light mx-0.5">&</span>
                <span className="text-[#fdfcf0]">В</span>
              </div>
              <div className="w-10 h-px bg-[#c5a059] my-1.5" />
              <span className="text-[10px] font-sans-clean uppercase tracking-[3px] text-[#fdfcf0] font-medium block">
                СМОЛЕНСК
              </span>
            </div>
          </BotanicalWreathBadge>

          {/* Greeting Heading - Natural Russian Salutation */}
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#ffffff] font-normal mt-4 mb-3">
            {formatGuestSalutation(guestName)}
          </h2>

          <p className="font-sans-clean text-sm sm:text-base text-[#fdfcf0]/90 font-normal max-w-lg mx-auto leading-relaxed mb-4 text-center">
            Разделите с нами этот особенный день, наполненный любовью, искренними улыбками и теплом осеннего вечера.
          </p>

          {/* Bride & Groom Names in Noble Royal Wedding Typography */}
          <div className="w-full my-4 py-5 border-y border-[#c5a059]/60 text-center bg-gradient-to-r from-transparent via-[#051a14]/90 to-transparent rounded-lg shadow-inner">
            <h1 className="font-royal-cormorant italic text-4xl sm:text-6xl md:text-7xl text-[#fdfcf0] tracking-wide leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)] font-semibold">
              <span className="text-[#ffffff]">Петр</span>
              <span className="font-serif-display not-italic text-2xl sm:text-4xl md:text-5xl text-[#ffd700] font-light mx-2 sm:mx-4 inline-block transform -translate-y-1">
                &
              </span>
              <span className="text-[#ffffff]">Виктория</span>
            </h1>
            <div className="flex items-center justify-center space-x-3 mt-2.5">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#c5a059]" />
              <span className="text-[10px] sm:text-xs font-sans-clean uppercase tracking-[4px] text-[#ffd700] font-medium">
                СВАДЕБНОЕ ТОРЖЕСТВО
              </span>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#c5a059]" />
            </div>
          </div>

          <FloralDivider className="my-3" />

          {/* Date & Location summary */}
          <div className="space-y-1 mb-8 text-center">
            <div className="font-serif-display text-2xl sm:text-3xl text-[#ffd700] font-semibold tracking-[2px]">
              30 СЕНТЯБРЯ 2026
            </div>
            <div className="font-sans-clean text-xs sm:text-sm uppercase tracking-widest text-[#fdfcf0] font-medium">
              СМОЛЕНСК — КЛУБ-ОТЕЛЬ «ВЫСОКОЕ»
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
            <button
              onClick={onScrollToRSVP}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#c5a059] hover:bg-[#d8b46e] text-[#051a14] font-sans-clean font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Подтвердить участие (RSVP)
            </button>

            <button
              onClick={onScrollToSchedule}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#051a14] hover:bg-[#0e352a] text-[#ffffff] border border-[#c5a059] font-sans-clean font-medium text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center cursor-pointer"
            >
              <MapPin className="w-4 h-4 mr-2 text-[#ffd700]" />
              Программа торжества
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
