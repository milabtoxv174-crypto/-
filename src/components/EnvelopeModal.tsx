import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MailOpen, Heart } from 'lucide-react';
import { weddingAudioPlayer } from '../utils/audio';
import { formatGuestSalutation } from '../utils/greeting';

interface EnvelopeModalProps {
  guestName: string;
  onOpen: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({ guestName, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    // 1. Immediately play audio in synchronous user-activation context
    try {
      weddingAudioPlayer.start().catch((e) => console.warn('Autoplay prevented:', e));
    } catch (e) {
      console.warn('Audio start error:', e);
    }
    setIsOpen(true);
    // 2. Notify parent
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03120e] overflow-hidden"
      >
        {/* Ambient Warm Golden Glow & Background Pattern */}
        <div className="absolute inset-0 sophisticated-dot-bg opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#b35d38]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-xl w-full flex flex-col items-center">
          {/* Guest Greeting Badge */}
          <motion.div
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-5 text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-[#0a2a22]/90 border border-[#c5a059]/60 px-5 py-2 rounded-full text-xs font-sans-clean uppercase tracking-[3px] text-[#e5c158] shadow-xl backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Свадебное торжество</span>
            </div>

            {guestName ? (
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#fdfcf0] mt-3 font-light tracking-wide">
                {formatGuestSalutation(guestName)}
              </h2>
            ) : (
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#fdfcf0] mt-3 font-light tracking-wide">
                Вам доставлено свадебное послание
              </h2>
            )}
          </motion.div>

          {/* Envelope Card Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={
              isOpen
                ? { scale: 1.08, opacity: 0, y: 60, rotateX: -25 }
                : { scale: 1, opacity: 1, y: 0 }
            }
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-[4/3] max-w-md sm:max-w-lg bg-gradient-to-b from-[#08241d] via-[#051a14] to-[#03130e] border-2 border-[#c5a059] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(197,160,89,0.2)] p-6 sm:p-8 flex flex-col justify-between items-center overflow-hidden group select-none"
          >
            {/* Elegant Golden Corner Accents with Filigree */}
            <div className="absolute top-3 left-3 w-8 h-8 pointer-events-none">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-[#c5a059]">
                <path d="M2 30V6C2 3.79086 3.79086 2 6 2H30" stroke="currentColor" strokeWidth="2" />
                <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                <path d="M2 14C8 14 14 8 14 2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
              </svg>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 pointer-events-none rotate-90">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-[#c5a059]">
                <path d="M2 30V6C2 3.79086 3.79086 2 6 2H30" stroke="currentColor" strokeWidth="2" />
                <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                <path d="M2 14C8 14 14 8 14 2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-3 left-3 w-8 h-8 pointer-events-none -rotate-90">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-[#c5a059]">
                <path d="M2 30V6C2 3.79086 3.79086 2 6 2H30" stroke="currentColor" strokeWidth="2" />
                <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                <path d="M2 14C8 14 14 8 14 2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-3 right-3 w-8 h-8 pointer-events-none rotate-180">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-[#c5a059]">
                <path d="M2 30V6C2 3.79086 3.79086 2 6 2H30" stroke="currentColor" strokeWidth="2" />
                <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                <path d="M2 14C8 14 14 8 14 2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
              </svg>
            </div>

            {/* Inner Gold Foil Frame */}
            <div className="absolute inset-3 sm:inset-4 border border-[#c5a059]/30 rounded-xl pointer-events-none" />

            {/* Envelope Flap Triangular Arch with Gold Trim */}
            <div className="absolute top-0 inset-x-0 h-[52%] bg-gradient-to-b from-[#0a2f26] to-[#041610] border-b-2 border-[#c5a059]/60 rounded-b-[100%] shadow-lg transition-transform duration-700 group-hover:scale-y-105 pointer-events-none opacity-95">
              <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            </div>

            {/* Couple Names & Wedding Date Header */}
            <div className="z-10 text-center pt-2 sm:pt-3">
              <span className="font-sans-clean text-[11px] sm:text-xs font-semibold uppercase tracking-[4px] text-[#e5c158] block drop-shadow-sm">
                ПЁТР & ВИКТОРИЯ
              </span>
              <span className="font-serif-display text-xs sm:text-sm text-[#fdfcf0]/85 italic mt-1 block tracking-wider">
                30 сентября 2026 года • Усадьба Высокое
              </span>
            </div>

            {/* Dimensional Luxury Wax Seal Button */}
            <div className="z-20 my-auto flex flex-col items-center">
              <motion.button
                onClick={handleOpenEnvelope}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="relative group/seal cursor-pointer focus:outline-none"
                aria-label="Открыть свадебное приглашение"
              >
                {/* Outer Wax Irregular / Scalloped Ring */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#e5c158] via-[#c5a059] to-[#785718] p-[3px] shadow-[0_10px_25px_rgba(0,0,0,0.7),0_0_20px_rgba(229,193,88,0.4)] flex items-center justify-center transition-all duration-300 group-hover/seal:shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_30px_rgba(229,193,88,0.6)]">
                  {/* Wax Inner Dish */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#061e17] via-[#041611] to-[#020b08] border border-[#e5c158]/70 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    {/* Radial gold sheen */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(229,193,88,0.25),transparent_70%)] pointer-events-none" />

                    {/* Monogram П & В - Fixed Single-Line Layout */}
                    <div className="flex items-center justify-center space-x-1.5 whitespace-nowrap z-10">
                      <span className="font-serif-display text-2xl sm:text-3xl text-[#e5c158] font-bold tracking-normal leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        П
                      </span>
                      <span className="font-serif-display text-base sm:text-lg text-[#c5a059] font-normal leading-none opacity-90">
                        &
                      </span>
                      <span className="font-serif-display text-2xl sm:text-3xl text-[#e5c158] font-bold tracking-normal leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        В
                      </span>
                    </div>

                    {/* Micro-label */}
                    <div className="z-10 mt-1 flex items-center space-x-1">
                      <span className="text-[8px] sm:text-[9px] font-sans-clean font-medium uppercase tracking-[2.5px] text-[#e5c158]/90">
                        ОТКРЫТЬ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pulsing Outer Ring */}
                <span className="absolute -inset-2 rounded-full border border-[#e5c158]/40 animate-ping opacity-30 pointer-events-none" />
              </motion.button>
            </div>

            {/* Bottom Invitation Prompt Button */}
            <div className="z-10 text-center pb-1 flex flex-col items-center">
              <button
                onClick={handleOpenEnvelope}
                className="font-sans-clean text-xs uppercase tracking-[2px] text-[#e5c158] flex items-center justify-center hover:text-[#ffffff] transition-all px-5 py-2 bg-[#051a14]/90 hover:bg-[#0a2a22] rounded-full border border-[#c5a059]/60 shadow-lg cursor-pointer group-hover:border-[#e5c158]"
              >
                <MailOpen className="w-3.5 h-3.5 mr-2 text-[#e5c158]" />
                Нажмите на печать, чтобы развернуть
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
