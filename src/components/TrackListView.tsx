import React, { useState } from 'react';
import type { JSX } from 'astro/jsx-runtime';
import TrackView, { type Track } from './TrackView';

interface TrackListViewProps {
  tracks: Track[];
  onItemClick?: (track: Track) => void;
}

function TrackListView({ tracks, onItemClick }: TrackListViewProps): JSX.Element {
  // 選択されたトラックを state で保持
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const handleClick = (track: Track) => {
    setSelectedTrack(track);
    // オプションの onItemClick が指定されていれば呼び出す
    if (onItemClick) {
      onItemClick(track);
    }
    // カスタムイベントを発火して、Player などに伝える（必要な場合）
    window.dispatchEvent(new CustomEvent('songSelected', { detail: track }));
  };

  return (
    <ul className="space-y-4">
      {tracks.map((track) => {
        // トラックが選択中かどうかを、videoId と trackNumber で比較
        const isSelected =
          selectedTrack !== null &&
          selectedTrack.videoId === track.videoId &&
          selectedTrack.trackNumber === track.trackNumber;

        return (
          <TrackView
            key={`${track.videoId}-${track.trackNumber}`}
            track={track}
            onClick={handleClick}
            isSelected={isSelected}
          />
        );
      })}
    </ul>
  );
}

export default TrackListView;
