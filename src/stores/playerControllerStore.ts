// src/stores/playerControllerStore.ts
import { create } from 'zustand';
import type { PlaylistStore } from './playlistStore';
import type { PlaybackStore } from './playbackStore';
import { createPlaylistStore } from './playlistStore';
import { createPlaybackStore } from './playbackStore';

export type PlayerControllerState = PlaylistStore & PlaybackStore;

export const usePlayerControllerStore = create<PlayerControllerState>((set, get, api) => ({
  ...createPlaylistStore(set, get, api),
  ...createPlaybackStore(set, get, api),
}));
