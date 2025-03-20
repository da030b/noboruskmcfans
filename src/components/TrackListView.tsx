import React, { useState, useEffect } from 'react';
import type { JSX } from 'astro/jsx-runtime';
import TrackView, { type Track as DisplayTrack } from './TrackView';
import { usePlayerControllerStore } from '../stores/playerControllerStore';
import { parseTimeToSeconds } from '../utils/time';

interface TrackListViewProps {
  tracks: DisplayTrack[]; // 表示用トラック (start/end は文字列)
  onItemClick?: (track: DisplayTrack) => void;
}

function TrackListView({ tracks, onItemClick }: TrackListViewProps): JSX.Element {
  const [selectedTrack, setSelectedTrack] = useState<DisplayTrack | null>(null);
  const initPlaylist = usePlayerControllerStore((state) => state.initPlaylist);

  useEffect(() => {
    // 表示用トラックを store 用に変換: videoId → vid, trackNumber → trackNumber, start/end を数値に変換
    const convertedTracks = tracks.map((t, index) => ({
      vid: t.videoId,
      tid: String(t.trackNumber),
      title: t.title,
      artist: t.artist,
      start: parseTimeToSeconds(t.start),
      end: parseTimeToSeconds(t.end),
      originalIndex: index,
    }));
    initPlaylist(convertedTracks);
  }, [tracks, initPlaylist]);

  const handleClick = (track: DisplayTrack) => {
    setSelectedTrack(track);
    if (onItemClick) onItemClick(track);
    window.dispatchEvent(new CustomEvent('songSelected', { detail: track }));
  };

  return (
    <ul className="space-y-4">
      {tracks.map((track) => {
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
