// src/stores/playerStore.ts
import { create } from 'zustand';

// トラック情報
export interface Track {
  vid: string;
  tid: string;
  title: string;
  artist: string;
  start: number;
  end: number;
}

// プレイヤー情報
interface PlayerState {
  currentTrack: Track | null;
  // シーク位置は開始位置からの相対値として扱う場合、初期値は 0 が望ましい
  currentSeconds: number;
  duration: number; // ＝track.end - track.start
  isPlaying: boolean;
  volume: number;

  play: () => void;
  pause: () => void;
  togglePlay: () => void;

  setCurrentTrack: (track: Track | null) => void;
  setCurrentSeconds: (sec: number) => void;

  setDuration: (sec: number) => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  currentSeconds: 0,
  duration: 0,
  isPlaying: false,
  volume: 50,
  setCurrentTrack: (track) =>
    set({
      currentTrack: track,
      // シーク位置は相対値なので、初期値は 0 にするのが一般的です
      currentSeconds: 0,
      duration: track ? track.end - track.start : 0,
      isPlaying: track ? true : false,
    }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set({ isPlaying: !get().isPlaying }),
  
  // 終了値に達しないようにクランプする
  setCurrentSeconds: (sec) =>
    set((state) => ({
      currentSeconds:
        state.duration > 0
          ? Math.min(sec, state.duration - 0.001) // 少数を使うことで、duration に達しないようにする
          : sec,
    })),
  setDuration: (sec) => set({ duration: sec }),
  setVolume: (volume) => set({ volume }),
}));
