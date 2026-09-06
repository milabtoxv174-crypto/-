import importedAudioFull from '../assets/audio/Lana_Del_Rey_-_Young_And_Beautiful_9752830.mp3';

export interface WeddingTrack {
  id: string;
  title: string;
  composer: string;
  tag: string;
  durationStr: string;
  sources: string[];
}

export interface PlayerState {
  isPlaying: boolean;
  volume: number;
  currentTrack: WeddingTrack;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export const MAIN_WEDDING_TRACK: WeddingTrack = {
  id: 'young-and-beautiful-lana-del-rey',
  title: 'Young and Beautiful',
  composer: 'Lana Del Rey',
  tag: 'Оригинальный трек • Lana Del Rey',
  durationStr: '3:56',
  sources: [
    importedAudioFull,
    './audio/Lana_Del_Rey_-_Young_And_Beautiful_9752830.mp3',
    '/audio/Lana_Del_Rey_-_Young_And_Beautiful_9752830.mp3',
    './audio/young_and_beautiful.mp3',
    '/audio/young_and_beautiful.mp3',
    './audio/young_and_beautiful_full.mp3',
    '/audio/young_and_beautiful_full.mp3',
    './young_and_beautiful.mp3',
    '/young_and_beautiful.mp3',
    './young_and_beautiful_full.mp3',
    '/young_and_beautiful_full.mp3',
  ],
};

type Listener = (state: PlayerState) => void;

class WeddingAudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying = false;
  private volume = 0.85;
  private isMuted = false;
  private currentTime = 0;
  private duration = 236;
  private isLoading = false;
  private error: string | null = null;
  private listeners: Set<Listener> = new Set();
  private currentSourceIdx = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDomAudio();
      this.setupGlobalUnlock();
    }
  }

  public registerAudioElement(element: HTMLAudioElement) {
    if (this.audioElement && this.audioElement !== element) {
      try {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement.onloadedmetadata = null;
        this.audioElement.ontimeupdate = null;
        this.audioElement.onplaying = null;
        this.audioElement.onpause = null;
        this.audioElement.onwaiting = null;
        this.audioElement.onerror = null;
      } catch {}
    }
    this.audioElement = element;
    if (!this.audioElement.src) {
      this.audioElement.src = MAIN_WEDDING_TRACK.sources[0];
    }
    this.bindElementEvents();
  }

  private initDomAudio() {
    if (typeof window === 'undefined') return;
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.loop = true;
      this.audioElement.src = MAIN_WEDDING_TRACK.sources[0];
      this.bindElementEvents();
    }
  }

  private bindElementEvents() {
    if (!this.audioElement) return;

    this.audioElement.volume = this.isMuted ? 0 : this.volume;

    this.audioElement.onloadedmetadata = () => {
      if (this.audioElement && !isNaN(this.audioElement.duration) && this.audioElement.duration > 0) {
        this.duration = this.audioElement.duration;
        this.isLoading = false;
        this.notify();
      }
    };

    this.audioElement.ontimeupdate = () => {
      if (this.audioElement) {
        const cur = this.audioElement.currentTime;
        if (Math.abs(cur - this.currentTime) >= 0.5) {
          this.currentTime = cur;
          this.notify();
        }
      }
    };

    this.audioElement.onplaying = () => {
      this.isPlaying = true;
      this.isLoading = false;
      this.error = null;
      this.notify();
    };

    this.audioElement.onpause = () => {
      this.isPlaying = false;
      this.notify();
    };

    this.audioElement.onwaiting = () => {
      this.isLoading = true;
      this.notify();
    };

    this.audioElement.onerror = () => {
      if (this.currentSourceIdx < MAIN_WEDDING_TRACK.sources.length - 1) {
        this.currentSourceIdx += 1;
        if (this.audioElement) {
          this.audioElement.src = MAIN_WEDDING_TRACK.sources[this.currentSourceIdx];
          this.audioElement.load();
          if (this.isPlaying) {
            this.audioElement.play().catch((err) => {
              console.warn('Playback retry error:', err);
            });
          }
        }
      }
    };
  }

  private setupGlobalUnlock() {
    const unlock = () => {
      if (this.audioElement && this.isPlaying && this.audioElement.paused) {
        this.audioElement.play().catch(() => {});
      }
    };

    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.warn('Listener notification error:', err);
      }
    });
  }

  public getState(): PlayerState {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      currentTrack: MAIN_WEDDING_TRACK,
      isMuted: this.isMuted,
      currentTime: this.currentTime,
      duration: this.duration || 236,
      isLoading: this.isLoading,
      error: this.error,
    };
  }

  public async start(): Promise<boolean> {
    this.initDomAudio();

    if (this.audioElement) {
      try {
        if (!this.audioElement.src) {
          this.audioElement.src = MAIN_WEDDING_TRACK.sources[this.currentSourceIdx];
        }
        this.audioElement.volume = this.isMuted ? 0 : this.volume;
        await this.audioElement.play();
        this.isPlaying = true;
        this.error = null;
        this.notify();
        return true;
      } catch (err) {
        console.warn('Direct HTML5 audio play error, retrying fallback source...', err);
        if (this.currentSourceIdx < MAIN_WEDDING_TRACK.sources.length - 1) {
          this.currentSourceIdx += 1;
          this.audioElement.src = MAIN_WEDDING_TRACK.sources[this.currentSourceIdx];
          try {
            await this.audioElement.play();
            this.isPlaying = true;
            this.notify();
            return true;
          } catch (e) {
            console.warn('Playback failed:', e);
          }
        }
      }
    }
    return false;
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {}
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public seek(seconds: number) {
    if (this.audioElement && !isNaN(seconds)) {
      this.audioElement.currentTime = seconds;
      this.currentTime = seconds;
      this.notify();
    }
  }

  public setCustomAudioSource(url: string) {
    this.initDomAudio();
    if (this.audioElement) {
      this.audioElement.src = url;
      this.audioElement.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((e) => {
        console.warn('Custom source error:', e);
      });
    }
  }
}

export const weddingAudioPlayer = new WeddingAudioPlayer();
