import React, { useState, useEffect, useRef } from 'react';
import {
  weddingAudioPlayer,
  PlayerState,
} from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Disc,
  ChevronDown,
  ChevronUp,
  Upload,
  Sparkles,
} from 'lucide-react';

export const MusicPlayerWidget: React.FC = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(
    weddingAudioPlayer.getState()
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = weddingAudioPlayer.subscribe((state) => {
      setPlayerState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    weddingAudioPlayer.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    weddingAudioPlayer.setVolume(parseFloat(e.target.value));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    weddingAudioPlayer.seek(parseFloat(e.target.value));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      weddingAudioPlayer.setCustomAudioSource(objectUrl);
      weddingAudioPlayer.start();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-4 sm:bottom-4 z-40 sm:w-80 pointer-events-auto">
      <div className="bg-[#0a2a22]/95 backdrop-blur-md border border-[#c5a059] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Hidden File Input for Custom Audio Replacement */}
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Compact Player Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#0e352a]/80 transition-colors"
        >
          <div className="flex items-center space-x-3 min-w-0">
            {/* Rotating Vinyl Record */}
            <div
              className={`relative w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-tr from-black via-[#1a1a1a] to-black border-2 border-[#c5a059] shadow-md flex items-center justify-center ${
                playerState.isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <Disc className="w-5 h-5 text-[#c5a059]" />
              <div className="absolute w-2.5 h-2.5 bg-[#c5a059] rounded-full border border-black" />
            </div>

            {/* Track Info */}
            <div className="min-w-0 pr-2">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif-display text-xs sm:text-sm font-semibold text-[#fdfcf0] truncate block">
                  {playerState.currentTrack.title}
                </span>
                {playerState.isPlaying && (
                  <span className="flex space-x-0.5 items-end h-3">
                    <span className="w-0.5 h-2 bg-[#c5a059] animate-pulse" />
                    <span className="w-0.5 h-3 bg-[#c5a059] animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-[#c5a059] animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p className="font-sans-clean text-[10px] text-[#c5a059] truncate">
                {playerState.currentTrack.composer}
              </p>
            </div>
          </div>

          {/* Quick Play/Pause & Expand Toggle */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-full bg-[#c5a059] hover:bg-[#d8b46e] text-[#051a14] transition-all shadow cursor-pointer"
              title={playerState.isPlaying ? 'Пауза' : 'Воспроизвести'}
            >
              {playerState.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1.5 text-[#c5a059] hover:text-[#fdfcf0] transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar in Compact Header */}
        <div className="w-full bg-[#051a14] h-1">
          <div
            className="bg-[#c5a059] h-full transition-all duration-300"
            style={{
              width: `${(playerState.currentTime / (playerState.duration || 1)) * 100}%`,
            }}
          />
        </div>

        {/* Expanded Controls Drawer */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-[#c5a059]/30 bg-[#051a14]/80 space-y-3 animate-fadeIn">
            {/* Track Tag */}
            <div className="text-center">
              <span className="inline-block px-2.5 py-0.5 bg-[#0a2a22] border border-[#c5a059]/30 rounded-full text-[10px] font-sans-clean text-[#c5a059]">
                {playerState.currentTrack.tag}
              </span>
            </div>

            {/* Seek Bar with Time Stamps */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={playerState.duration || 236}
                step="1"
                value={playerState.currentTime || 0}
                onChange={handleSeek}
                className="w-full accent-[#c5a059] h-1.5 bg-[#0a2a22] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-sans-clean text-[#fdfcf0]/60">
                <span>{formatTime(playerState.currentTime)}</span>
                <span>{formatTime(playerState.duration)}</span>
              </div>
            </div>

            {/* Main Center Play Button */}
            <div className="flex items-center justify-center pt-1">
              <button
                onClick={handleTogglePlay}
                className="px-6 py-2 rounded-full bg-[#c5a059] hover:bg-[#d8b46e] text-[#051a14] font-medium text-xs font-sans-clean flex items-center space-x-2 transition-all shadow-lg cursor-pointer"
              >
                {playerState.isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Приостановить</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Слушать композицию</span>
                  </>
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => weddingAudioPlayer.toggleMute()}
                className="text-[#c5a059] hover:text-[#fdfcf0] transition-colors p-1"
                title={playerState.isMuted ? 'Включить звук' : 'Без звука'}
              >
                {playerState.isMuted || playerState.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={playerState.isMuted ? 0 : playerState.volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#c5a059] h-1.5 bg-[#0a2a22] rounded-lg cursor-pointer"
              />
            </div>

            {/* Upload Custom Audio Button (for local MP3 replacement) */}
            <div className="pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-3 bg-[#0a2a22] hover:bg-[#103b30] border border-[#c5a059]/30 hover:border-[#c5a059] rounded-lg text-[11px] font-sans-clean text-[#c5a059] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Загрузить свой аудиофайл с устройства</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
