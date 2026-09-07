import React, { useState, useEffect } from 'react';
import { HeaderHero } from './components/HeaderHero';
import { Countdown } from './components/Countdown';
import { LoveStory } from './components/LoveStory';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { VenueHighlight } from './components/VenueHighlight';
import { DressCode } from './components/DressCode';
import { DetailsFAQ } from './components/DetailsFAQ';
import { Gallery } from './components/Gallery';
import { InteractiveMap } from './components/InteractiveMap';
import { RSVPForm } from './components/RSVPForm';
import { OrganizerModal } from './components/OrganizerModal';
import { EnvelopeModal } from './components/EnvelopeModal';
import { FallingLeavesOverlay } from './components/FallingLeavesOverlay';
import { ScrollReveal } from './components/ScrollReveal';
import { MusicPlayerWidget } from './components/MusicPlayerWidget';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { weddingAudioPlayer } from './utils/audio';
import { Heart, ShieldCheck, Share2, Sparkles, MapPin, Link as LinkIcon, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [isLeavesActive, setIsLeavesActive] = useState(true);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [organizerDefaultTab, setOrganizerDefaultTab] = useState<'rsvps' | 'links' | 'sheets' | 'settings'>('links');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const guestParam = (params.get('guest') || params.get('name') || '').trim();

      if (guestParam) {
        // PERSONAL GUEST LINK:
        // When opened via ?guest=Имя or ?name=Имя
        // Strict read-only guest format without editing controls or organizer buttons.
        setIsGuestMode(true);
        setGuestName(decodeURIComponent(guestParam));
        setIsOrganizerOpen(false);
      } else {
        // MAIN MASTER LINK:
        // Host/Organizer main link has full access to link creation and organizer panel!
        setIsGuestMode(false);
      }
    }
  }, []);

  const handleOpenEnvelope = () => {
    setShowEnvelope(false);
    weddingAudioPlayer.start();
  };

  const handleToggleMusic = () => {
    weddingAudioPlayer.toggle();
  };

  const scrollToRSVP = () => {
    const element = document.getElementById('rsvp');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSchedule = () => {
    const element = document.getElementById('schedule');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Приглашение на свадьбу Петра и Виктории',
        text: '30 сентября 2026 года — Приглашение на свадьбу Петра и Виктории',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#051a14] text-[#fdfcf0] font-sans-clean relative selection:bg-[#c5a059] selection:text-[#051a14] overflow-x-hidden">
      {/* Top Bar for Master Link (Host / Organizer) */}
      {!isGuestMode && !showEnvelope && (
        <header className="sticky top-0 z-40 bg-[#051a14]/95 backdrop-blur-md border-b border-[#c5a059]/40 py-2.5 px-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-[#ffd700]">
              <ShieldCheck className="w-4 h-4 text-[#ffd700]" />
              <span className="font-serif-display text-sm font-semibold tracking-wide text-[#fdfcf0]">
                Основная ссылка организатора
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setOrganizerDefaultTab('links');
                  setIsOrganizerOpen(true);
                }}
                className="px-3 py-1.5 bg-[#ffd700] hover:bg-[#ffe234] text-[#051a14] font-bold rounded-md flex items-center gap-1.5 transition-all shadow cursor-pointer text-xs"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#051a14]" />
                <span>Создать ссылку для гостя</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrganizerDefaultTab('sheets');
                  setIsOrganizerOpen(true);
                }}
                className="px-3 py-1.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] border border-[#ffd700]/60 rounded-md flex items-center gap-1.5 transition-all cursor-pointer text-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Таблица</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrganizerDefaultTab('rsvps');
                  setIsOrganizerOpen(true);
                }}
                className="px-3 py-1.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#fdfcf0] border border-[#c5a059]/50 rounded-md flex items-center gap-1.5 transition-all cursor-pointer text-xs"
              >
                <span>Ответы гостей</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Envelope Opening Screen */}
      {showEnvelope && (
        <EnvelopeModal guestName={guestName} onOpen={handleOpenEnvelope} />
      )}

      {/* Falling Leaves Animation Layer */}
      <FallingLeavesOverlay active={isLeavesActive} />

      {/* Hero Section */}
      <HeaderHero
        guestName={guestName}
        setGuestName={setGuestName}
        onToggleMusic={handleToggleMusic}
        isLeavesActive={isLeavesActive}
        onToggleLeaves={() => setIsLeavesActive(!isLeavesActive)}
        onScrollToRSVP={scrollToRSVP}
        onScrollToSchedule={scrollToSchedule}
      />

      {/* Main Content Sections with ScrollReveal */}
      <main className="space-y-4 pb-16">
        <ScrollReveal direction="up" delay={0.1}>
          <Countdown />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <LoveStory />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <ScheduleTimeline />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <VenueHighlight />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <DressCode />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <DetailsFAQ />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <InteractiveMap />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <Gallery />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <RSVPForm initialGuestName={guestName} />
        </ScrollReveal>
      </main>

      {/* Footer & Mode Specific Controls */}
      <footer className="border-t border-[#c5a059]/30 py-10 px-4 bg-[#051a14] text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="font-serif-display text-2xl text-[#c5a059] tracking-widest font-semibold select-none">
            Петр & Виктория
          </div>

          <p className="font-serif-display text-sm text-[#fdfcf0]/80 italic">
            С любовью ждём вас 30 сентября 2026 года!
          </p>

          {/* Mode-specific actions: Main Organizer vs Guest */}
          {!isGuestMode ? (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOrganizerDefaultTab('links');
                    setIsOrganizerOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#ffd700] hover:bg-[#ffe234] text-[#051a14] font-bold text-xs font-sans-clean rounded-lg border border-[#ffd700] flex items-center transition-all cursor-pointer shadow-md hover:scale-[1.02]"
                >
                  <LinkIcon className="w-3.5 h-3.5 mr-1.5 text-[#051a14]" />
                  <span>Создать персональную ссылку для гостя</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrganizerDefaultTab('rsvps');
                    setIsOrganizerOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#0a2a22] hover:bg-[#113a30] text-[#ffd700] text-xs font-sans-clean rounded-lg border border-[#c5a059] flex items-center transition-all cursor-pointer shadow-md hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#ffd700]" />
                  <span>Панель ответов гостей</span>
                </button>
              </div>

              <p className="text-[11px] text-[#fdfcf0]/60 max-w-md mx-auto leading-normal">
                👑 Режим организатора: создание ссылок, редактирование и просмотр анкет доступны только на этой основной ссылке.
              </p>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <p className="text-xs text-[#ffd700] font-serif-display italic">
                Персональное приглашение для: <span className="text-[#ffffff] font-normal not-italic">{guestName}</span>
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleShareApp}
                  className="px-4 py-2 bg-[#0a2a22] hover:bg-[#113a30] text-[#fdfcf0] text-xs font-sans-clean rounded border border-[#c5a059]/40 flex items-center transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" />
                  {copiedLink ? 'Ссылка скопирована' : 'Поделиться приглашением'}
                </button>
              </div>
            </div>
          )}

          <div className="text-[11px] text-[#fdfcf0]/50 pt-4 font-sans-clean">
            30.09.2026 — Дворец бракосочетания (Смоленск) & Клуб-Отель «Высокое»
          </div>
        </div>
      </footer>

      {/* Organizer Dashboard Modal */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
        defaultTab={organizerDefaultTab}
      />

      {/* Global In-DOM HTML5 Audio Element for Cross-Platform Reliability */}
      <GlobalAudioPlayer />

      {/* Floating Wedding Music Player */}
      {!showEnvelope && <MusicPlayerWidget />}
    </div>
  );
}
