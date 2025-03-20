// src/stores/playlistStore.ts
import type { StateCreator } from 'zustand';
import type { Track, LoopMode } from '../types/playerControllerTypes';
import { shuffleArray } from '../utils/shuffle';

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
  set: any,
  get: any,
  _api: any
) => ({
  originalPlaylist: [],
  currentPlaylist: [],
  currentTrackIndex: null,
  loopMode: "none",
  shuffleMode: false,

  initPlaylist: (tracks: Track[]) => {
    set({
      originalPlaylist: [...tracks],
      currentPlaylist: [...tracks],
      // 初期状態は曲選択待ち
      currentTrackIndex: null,
    });
  },

  // 修正: 選択時に再生位置と再生状態を更新
  selectTrack: (index: number) => {
    const { currentPlaylist } = get();
    const track: Track = currentPlaylist[index];
    if (track) {
      set({
        currentTrackIndex: index,
        playedSeconds: track.loopStart,
        isPlaying: true,
      });
    }
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
        const current: Track = state.originalPlaylist[state.currentTrackIndex];
        const remaining = state.originalPlaylist.filter((_: any, i: number) => i !== state.currentTrackIndex);
        const shuffled = shuffleArray(remaining);
        return {
          shuffleMode: true,
          currentPlaylist: [current, ...shuffled],
          currentTrackIndex: 0,
        };
      } else {
        if (state.currentTrackIndex !== null) {
          const current: Track = state.currentPlaylist[state.currentTrackIndex];
          const newIndex = state.originalPlaylist.findIndex(
            (track: Track) => track.originalIndex === current.originalIndex
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

  // 修正: 戻るボタンは再生位置が1秒以上なら、同じ曲の先頭にシークする
  handlePrev: () => {
    const { currentTrackIndex, currentPlaylist, playedSeconds, updatePlayedSeconds, setDesiredSeekTime } = get();
    if (currentTrackIndex === null) return;
    const track: Track = currentPlaylist[currentTrackIndex];
    const relativeTime = playedSeconds - track.loopStart;
    if (relativeTime >= 1) {
      updatePlayedSeconds(track.loopStart);
      setDesiredSeekTime(track.loopStart);
    } else if (currentTrackIndex > 0) {
      get().selectTrack(currentTrackIndex - 1);
      const newTrack: Track = currentPlaylist[currentTrackIndex - 1];
      updatePlayedSeconds(newTrack.loopStart);
      setDesiredSeekTime(newTrack.loopStart);
    }
  },

  handleNext: () => {
    const { currentTrackIndex, currentPlaylist, loopMode, updatePlayedSeconds } = get();
    if (currentTrackIndex === null) return;
    if (currentTrackIndex < currentPlaylist.length - 1) {
      get().selectTrack(currentTrackIndex + 1);
      const newTrack: Track = currentPlaylist[currentTrackIndex + 1];
      updatePlayedSeconds(newTrack.loopStart);
    } else {
      if (loopMode === "playlist") {
        get().selectTrack(0);
        const newTrack: Track = currentPlaylist[0];
        updatePlayedSeconds(newTrack.loopStart);
      } else {
        set({ currentTrackIndex: null });
      }
    }
  },

  handleEnded: () => {
    const { currentTrackIndex, currentPlaylist, loopMode } = get();
    if (currentTrackIndex === null) return;
    if (loopMode === "single") {
      // 単曲リピートは playbackStore 側で処理
      return;
    } else if (loopMode === "none") {
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
