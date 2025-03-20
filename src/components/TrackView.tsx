import type { JSX } from 'astro/jsx-runtime';
import { parseTimeToSeconds, formatSeconds } from '../utils/time'
export interface Track {
  videoId: string;
  trackNumber: number;
  title: string;
  artist: string;
  tags: string[];
  start: string;
  end: string;
}

interface TrackViewProps {
  track: Track;
  onClick: (track: Track) => void;
  isSelected?: boolean;
}

function TrackView({ track, onClick, isSelected }: TrackViewProps): JSX.Element {
  return (
    <li
      onClick={() => onClick(track)}
      // 選択中の場合、背景色などで強調（例として bg-blue-100 を追加）
      className={`border p-4 rounded shadow cursor-pointer ${
        isSelected ? 'bg-gray-100' : ''
      }`}
    >
      <div>
        <span className="font-bold">
          トラック {track.trackNumber}: {track.title}
        </span>
        <span className="ml-2 text-sm text-gray-600">
          by {track.artist}
        </span>
      </div>
      <div className="mt-1">
        <span>{formatSeconds(parseTimeToSeconds(track.end)-parseTimeToSeconds(track.start))}</span>
      </div>
      <div className="mt-1">
        <span className="text-sm text-gray-500">
          Tags: {track.tags.join(', ')}
        </span>
      </div>
    </li>
  );
}

export default TrackView;