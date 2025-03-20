export interface Track {
  vid: string;       // YouTube 動画ID
  tid: string;       // トラック番号（文字列）
  title: string;
  artist: string;
  start: number;     // 再生開始位置（秒、数値）
  end: number;       // 再生終了位置（秒、数値）
  originalIndex: number;
}

export type LoopMode = "none" | "playlist" | "single";

export interface VideoWithDetails {
  videoId: string;
  timestamps: {
    start: string;
    end: string;
    songTitle: string;
    songArtist: string;
  }[];
}
