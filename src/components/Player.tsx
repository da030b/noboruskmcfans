import React, { useEffect, useRef } from 'react';
import { usePlayerStore, type Track } from '../stores/playerStore';
import { useProgressBar } from '../hooks/useProgressBar';

// "HH:MM:SS" を秒数に変換するヘルパー関数
function convertTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
}

export default function Player() {
  const { currentTrack, currentSeconds, duration, setCurrentSeconds, setCurrentTrack } = usePlayerStore();
  const progressRef = useRef<HTMLInputElement>(null);

  // progress bar の背景更新（currentSeconds に依存）
  useProgressBar(progressRef, currentSeconds);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSeconds(Number(e.target.value));
  };

  // カスタムイベント "songSelected" をリッスンして、選択された曲情報を store にセットする
  useEffect(() => {
    const handleSongSelected = (event: CustomEvent) => {
      const detail = event.detail;
      const newTrack: Track = {
        vid: detail.videoId,
        tid: detail.tid,
        title: detail.title,
        artist: detail.artist,
        // start, end が文字列の場合は変換。数値の場合はそのまま利用
        start: typeof detail.start === 'string' ? convertTimeToSeconds(detail.start) : detail.start,
        end: typeof detail.end === 'string' ? convertTimeToSeconds(detail.end) : detail.end,
      };
      setCurrentTrack(newTrack);
    };

    window.addEventListener('songSelected', handleSongSelected as EventListener);
    return () => {
      window.removeEventListener('songSelected', handleSongSelected as EventListener);
    };
  }, [setCurrentTrack]);

  return (
    <div className="fixed bottom-0 inset-x-0 bg-base-200 text-base-content px-6 py-3 shadow-lg border-t border-base-300">
      {/* プログレスバー */}
      <input
        ref={progressRef}
        type="range"
        id="progress"
        min="0"
        max={duration || 100}
        value={currentSeconds}
        onChange={handleProgressChange}
        className="w-full cursor-pointer"
      />

      {/* その他の UI */}
      <div className="flex justify-between items-center gap-4 mt-3">
        <div className="flex gap-2 items-center truncate">
          <div className="w-8 h-8 bg-base-100 rounded shadow flex justify-center items-center">
            🎵
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold truncate">
              {currentTrack ? currentTrack.title : 'No Track'}
            </p>
            <p className="text-xs truncate opacity-70">
              {currentTrack ? currentTrack.artist : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-sm btn-circle btn-ghost">⏮️</button>
          <button className="btn btn-circle btn-primary">▶️</button>
          <button className="btn btn-sm btn-circle btn-ghost">⏭️</button>
        </div>
      </div>
    </div>
  );
}
