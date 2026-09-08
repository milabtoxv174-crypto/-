import React, { useEffect, useRef } from 'react';
import { weddingAudioPlayer, MAIN_WEDDING_TRACK } from '../utils/audio';

export const GlobalAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      weddingAudioPlayer.registerAudioElement(audioRef.current);
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      id="wedding-main-audio"
      src={MAIN_WEDDING_TRACK.sources[0]}
      preload="metadata"
      loop
      playsInline
      className="hidden"
      aria-hidden="true"
    />
  );
};
