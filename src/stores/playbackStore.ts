// src/stores/playbackStore.ts
import type { StateCreator } from 'zustand';
import type { Track, LoopMode } from '../types/playerControllerTypes';

export interface PlaybackStore {
  playedSeconds: number;
  isPlaying: boolean;
  volume: number;
  desiredSeekTime: number | null;
  togglePlayPause: () => void;
  setPlaying: (playing: boolean) => void;
  updatePlayedSeconds: (seconds: number) => void;
  setDesiredSeekTime: (time: number | null) => void;
  setVolume: (volume: number) => void;
  handleProgress: (seconds: number) => void;
}

let isRepeatingSingle = false;
let isEndingTriggered = false;

export const createPlaybackStore: StateCreator<any, [], [], PlaybackStore> = (
  set: any,
  get: any,
  _api: any
) => ({
  playedSeconds: 0,
  isPlaying: false,
  volume: 50,
  desiredSeekTime: null,
  togglePlayPause: () => {
    set((state: any) => ({ isPlaying: !state.isPlaying }));
  },
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  updatePlayedSeconds: (seconds: number) => set({ playedSeconds: seconds }),
  setDesiredSeekTime: (time: number | null) => set({ desiredSeekTime: time }),
  setVolume: (volume: number) => set({ volume }),
  handleProgress: (seconds: number) => {
    const { currentPlaylist, currentTrackIndex, loopMode, handleEnded } = get();
    if (currentTrackIndex === null || currentPlaylist.length === 0) {
      set({ playedSeconds: seconds });
      return;
    }
    const track: Track = currentPlaylist[currentTrackIndex];
    if (seconds >= track.loopEnd) {
      if (loopMode === "single") {
        if (!isRepeatingSingle) {
          isRepeatingSingle = true;
          set({ playedSeconds: track.loopStart });
          get().setDesiredSeekTime(track.loopStart);
          setTimeout(() => { isRepeatingSingle = false; }, 500);
          return;
        }
      } else {
        if (!isEndingTriggered) {
          isEndingTriggered = true;
          if (typeof get().handleEnded === 'function') {
            get().handleEnded();
          }
          setTimeout(() => { isEndingTriggered = false; }, 500);
          return;
        }
      }
    }
    set({ playedSeconds: seconds });
  },
});
