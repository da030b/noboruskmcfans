import type { StateCreator } from 'zustand';
import type { Track, LoopMode } from '../types/playerControllerTypes';
import { shuffleArray } from '../utils/shuffle';
import { parseTimeToSeconds } from '../utils/time';

export interface PlaylistStore {
  originalPlaylist: Track[];
  currentPlaylist: Track[];
  currentTrackIndex: number | null;
  loopMode: LoopMode;
  shuffleMode: boolean;
  initPlaylist: (tracks: Track[]) => void;
  selectTrack: (index: number) => void;
  toggleLoopMode: () => void;
  toggleShuffleMode: () => void;
  handlePrev: () => void;
  handleNext: () => void;
  handleEnded: () => void;
}

export const createPlaylistStore: StateCreator<any, [], [], PlaylistStore> = (
  set,
  get,
  _api
) => ({
  originalPlaylist: [],
  currentPlaylist: [],
  currentTrackIndex: null,
  loopMode: "none",
  shuffleMode: false,

  initPlaylist: (tracks: Track[]) => {
    // tracks はすでに変換済みの store 用 Track オブジェクト
    set({
      originalPlaylist: [...tracks],
      currentPlaylist: [...tracks],
      currentTrackIndex: null,
    });
  },

  selectTrack: (index: number) => {
    const { currentPlaylist } = get();
    if (index < 0 || index >= currentPlaylist.length) return;
    set({
      currentTrackIndex: index,
      playedSeconds: currentPlaylist[index].start,
      isPlaying: true,
    });
  },

  toggleLoopMode: () => {
    set((state: any) => {
      if (state.loopMode === "none") return { loopMode: "playlist" };
      if (state.loopMode === "playlist") return { loopMode: "single" };
      return { loopMode: "none" };
    });
  },

  toggleShuffleMode: () => {
    set((state: any) => {
      const newShuffle = !state.shuffleMode;
      if (newShuffle) {
        if (state.currentTrackIndex === null) return { shuffleMode: true };
        const current = state.originalPlaylist[state.currentTrackIndex];
        const remaining = state.originalPlaylist.filter((_: any, i: number) => i !== state.currentTrackIndex);
        const shuffled = shuffleArray(remaining);
        return {
          shuffleMode: true,
          currentPlaylist: [current, ...shuffled],
          currentTrackIndex: 0,
        };
      } else {
        if (state.currentTrackIndex !== null) {
          const current = state.currentPlaylist[state.currentTrackIndex];
          const newIndex = state.originalPlaylist.findIndex(
            (t: Track) => t.vid === current.vid && t.tid === current.tid
          );
          return {
            shuffleMode: false,
            currentPlaylist: [...state.originalPlaylist],
            currentTrackIndex: newIndex,
          };
        } else {
          return { shuffleMode: false, currentPlaylist: [...state.originalPlaylist] };
        }
      }
    });
  },

  handlePrev: () => {
    // 必要なら実装
  },

  handleNext: () => {
    // 必要なら実装
  },

  handleEnded: () => {
    const { currentTrackIndex, currentPlaylist, loopMode } = get();
    if (currentTrackIndex === null) return;
    if (loopMode === "single") {
      // 単曲リピートは playbackStore 側で対処
      return;
    }
    if (loopMode === "none") {
      if (currentTrackIndex === currentPlaylist.length - 1) {
        set({ currentTrackIndex: null });
      } else {
        get().selectTrack(currentTrackIndex + 1);
      }
    } else if (loopMode === "playlist") {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= currentPlaylist.length) nextIndex = 0;
      get().selectTrack(nextIndex);
    }
  },
});
