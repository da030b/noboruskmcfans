// src/types/playerControllerTypes.ts
export interface Track {
  videoId: string;
  url: string;
  title: string;
  artist: string;
  loopStart: number;
  loopEnd: number;
  originalIndex: number;
}

export type LoopMode = "none" | "playlist" | "single";

// 動画データの型（例）
export interface VideoWithDetails {
  videoId: string;
  timestamps: {
    start: string;
    end: string;
    songTitle: string;
    songArtist: string;
  }[];
}
