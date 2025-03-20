import type { Timestamp } from 'src/types';
// Video型
export interface Video {
  videoId: string;
  timestamps: Timestamp[];
}
export type VideoList = Video[];
