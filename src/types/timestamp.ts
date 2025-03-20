// 元データの型 (YAMLから取得した元の型)
export interface Timestamp {
  trackNumber: number;
  songId: string;
  start: string;
  end: string;
}

// 表示用にsongTitle, songArtist, tagsを追加した型
export interface TimestampWithDetails extends Timestamp {
  songTitle: string;
  songArtist: string;
  tags: string[];
}

export interface VideoWithDetails {
  videoId: string;
  timestamps: TimestampWithDetails[];
}

export interface PlaylistManagerProps {
  videos: VideoWithDetails[];
}