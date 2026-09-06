import React from 'react';
import botanicalWreathImg from '../assets/images/botanical_gold_wreath_1788681493247.jpg';
import weddingRingsGoldImg from '../assets/images/wedding_rings_gold_1788681474226.jpg';

export const BotanicalCorner: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ className = '', position = 'top-left' }) => {
  const positionClasses = {
    'top-left': 'top-2.5 left-2.5 sm:top-3.5 sm:left-3.5',
    'top-right': 'top-2.5 right-2.5 sm:top-3.5 sm:right-3.5',
    'bottom-left': 'bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5',
    'bottom-right': 'bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5',
  }[position];

  const rotation = {
    'top-left': '',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <div
      className={`absolute pointer-events-none text-[#c5a059] opacity-75 transform ${rotation} ${positionClasses} ${className} z-0`}
      aria-hidden="true"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 sm:w-8 sm:h-8"
      >
        {/* Luxury Gold Corner Filigree */}
        <path
          d="M2 2 L2 20 M2 2 L20 2"
          stroke="#c5a059"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M6 6 L6 14 M6 6 L14 6"
          stroke="#ffd700"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <circle cx="2" cy="2" r="1.5" fill="#ffd700" />
        <circle cx="6" cy="6" r="1" fill="#c5a059" />
        <path
          d="M6 16 C8 11 11 8 16 6"
          stroke="#e8ca8c"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
};

export const CardGoldenCorners: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <>
      <BotanicalCorner position="top-left" className={className} />
      <BotanicalCorner position="top-right" className={className} />
      <BotanicalCorner position="bottom-left" className={className} />
      <BotanicalCorner position="bottom-right" className={className} />
    </>
  );
};

export const FloralDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-5 space-x-3 text-[#d4af37] ${className}`} aria-hidden="true">
      <div className="w-14 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37]/80 to-[#d4af37]" />
      
      {/* Central Botanical / Flower Emblem */}
      <div className="flex items-center space-x-2 opacity-95">
        {/* Left leaf */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transform -scale-x-100 text-[#d4af37]">
          <path
            d="M21 3C14 4 8 9 6 15C5 18 5 21 5 21C5 21 8 21 11 20C17 18 22 12 23 5L21 3Z"
            fill="currentColor"
            fillOpacity="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>

        {/* Center rose bloom */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#ffd700]">
          <circle cx="12" cy="12" r="3.5" fill="#d4af37" />
          <path
            d="M12 3C14.5 6.5 17 8 17 12C17 16 14.5 17.5 12 21C9.5 17.5 7 16 7 12C7 8 9.5 6.5 12 3Z"
            fill="#fff8dc"
            fillOpacity="0.45"
            stroke="#d4af37"
            strokeWidth="1"
          />
          <path
            d="M3 12C6.5 9.5 8 7 12 7C16 7 17.5 9.5 21 12C17.5 14.5 16 17 12 17C8 17 6.5 14.5 3 12Z"
            fill="#fff8dc"
            fillOpacity="0.45"
            stroke="#d4af37"
            strokeWidth="1"
          />
        </svg>

        {/* Right leaf */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#d4af37]">
          <path
            d="M21 3C14 4 8 9 6 15C5 18 5 21 5 21C5 21 8 21 11 20C17 18 22 12 23 5L21 3Z"
            fill="currentColor"
            fillOpacity="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="w-14 sm:w-24 h-px bg-gradient-to-l from-transparent via-[#d4af37]/80 to-[#d4af37]" />
    </div>
  );
};

export const BotanicalWreathBadge: React.FC<{
  children?: React.ReactNode;
  className?: string;
  sizeClass?: string;
}> = ({ children, className = '', sizeClass = 'w-44 h-44 sm:w-52 sm:h-52' }) => {
  return (
    <div className={`relative flex items-center justify-center mx-auto my-4 ${className}`}>
      {/* Luxury Botanical Floral Wreath Photo Background */}
      <div className={`relative ${sizeClass} rounded-full flex items-center justify-center p-2 shadow-2xl overflow-hidden border-2 border-[#d4af37]`}>
        <img
          src={botanicalWreathImg}
          alt="Botanical Wedding Wreath"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover filter brightness-105 contrast-105"
        />
        {/* Soft emerald central vignette so typography is crystal clear */}
        <div className="absolute inset-3 rounded-full bg-[#051a14]/80 backdrop-blur-[1.5px] ring-1 ring-[#ffd700]/70 ring-inset flex items-center justify-center" />
        
        {/* Content Centered inside the floral wreath */}
        <div className="relative z-10 text-center p-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export const FloralGarlandBanner: React.FC<{
  className?: string;
  heightClass?: string;
}> = ({ className = '', heightClass = 'h-24 sm:h-32' }) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-lg my-6 ${heightClass} ${className} bg-gradient-to-r from-[#041712] via-[#0a2a22] to-[#041712] border-y border-[#d4af37]/40 flex items-center justify-center`}>
      <FloralDivider className="scale-125" />
    </div>
  );
};

export const WeddingRingsFloralBadge: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`relative w-32 h-32 sm:w-44 sm:h-44 mx-auto rounded-full overflow-hidden border-2 border-[#d4af37] shadow-2xl bg-[#051a14] group ${className}`}>
      <img
        src={weddingRingsGoldImg}
        alt="Золотые обручальные кольца на изумрудном бархате"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover filter brightness-105 contrast-105 transition-transform duration-700 group-hover:scale-105"
      />
      {/* Golden bezel ring overlay */}
      <div className="absolute inset-0 ring-2 ring-inset ring-[#d4af37]/80 rounded-full pointer-events-none" />
      <div className="absolute inset-1.5 ring-1 ring-inset ring-[#ffd700]/40 rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#051a14]/35 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

