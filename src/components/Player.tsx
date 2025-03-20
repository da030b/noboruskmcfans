import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { usePlayerControllerStore } from '../stores/playerControllerStore';
import { useProgressBar } from '../hooks/useProgressBar';

export default function Player() {
  // すべての Hooks は必ず同じ順序で呼ぶ
  const {
    currentPlaylist,
    currentTrackIndex,
    playedSeconds,
    updatePlayedSeconds,
    isPlaying,
    togglePlayPause,
    handleEnded,
    selectTrack,
  } = usePlayerControllerStore();

  const progressRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const endedTriggered = useRef(false);

  // 自動選択処理: トラックがあれば currentTrackIndex が null の場合は最初の曲を選択
  useEffect(() => {
    if (currentPlaylist.length > 0 && currentTrackIndex === null) {
      selectTrack(0);
    }
  }, [currentPlaylist, currentTrackIndex, selectTrack]);

  // 現在のトラックを取得（store の Track 型は { vid, tid, title, artist, start, end, originalIndex }）
  const currentTrack =
    currentTrackIndex !== null && currentPlaylist[currentTrackIndex]
      ? currentPlaylist[currentTrackIndex]
      : null;

  // useProgressBar は必ず呼ぶ（currentTrack が無くても 0 を渡す）
  useProgressBar(progressRef, playedSeconds - (currentTrack ? currentTrack.start : 0));

  // onPlayerProgress: ReactPlayer の playedSeconds は絶対秒数
  const onPlayerProgress = (state: { playedSeconds: number }) => {
    if (currentTrack) {
      if (state.playedSeconds >= currentTrack.end) {
        if (!endedTriggered.current) {
          endedTriggered.current = true;
          handleEnded();
        }
        return;
      } else {
        endedTriggered.current = false;
      }
      updatePlayedSeconds(state.playedSeconds);
    }
  };

  const getProgressValue = () => (currentTrack ? playedSeconds - currentTrack.start : 0);
  const getProgressMax = () => (currentTrack ? currentTrack.end - currentTrack.start : 100);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentTrack) {
      const newOffset = Number(e.target.value);
      const newAbsoluteTime = currentTrack.start + newOffset;
      updatePlayedSeconds(newAbsoluteTime);
      playerRef.current?.seekTo(newAbsoluteTime, 'seconds');
    }
  };

  // "songSelected" イベント受信：表示側の { videoId, trackNumber } と store の { vid, tid } を比較
  useEffect(() => {
    const handleSongSelected = (event: CustomEvent) => {
      const selected = event.detail; // 例: { videoId, trackNumber, ... }
      const index = currentPlaylist.findIndex(
        (t: any) =>
          t.vid === selected.videoId &&
          t.tid === String(selected.trackNumber)
      );
      if (index !== -1) {
        selectTrack(index);
      }
    };
    window.addEventListener('songSelected', handleSongSelected as EventListener);
    return () => {
      window.removeEventListener('songSelected', handleSongSelected as EventListener);
    };
  }, [currentPlaylist, selectTrack]);

  // レンダリング結果：すべての Hooks が呼ばれた後に表示する
  return (
    <div>
      {currentTrack ? (
        <>
          <div className="fixed bottom-0 inset-x-0 bg-base-200 text-base-content px-6 py-3 shadow-lg border-t border-base-300">
            <input
              ref={progressRef}
              type="range"
              min={0}
              max={getProgressMax()}
              value={getProgressValue()}
              onChange={handleProgressChange}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between items-center gap-4 mt-3">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 bg-base-100 rounded shadow flex justify-center items-center">🎵</div>
                <div>
                  <p className="text-sm font-semibold">{currentTrack.title}</p>
                  <p className="text-xs opacity-70">{currentTrack.artist}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-sm btn-circle btn-ghost">⏮️</button>
                <button onClick={togglePlayPause} className="btn btn-circle btn-primary">
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="btn btn-sm btn-circle btn-ghost">⏭️</button>
              </div>
            </div>
          </div>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              clip: 'rect(0, 1px, 1px, 0)',
            }}
          >
            <ReactPlayer
              ref={playerRef}
              url={`${"https://www.youtube.com/watch?v=" + currentTrack.vid}&start=${currentTrack.start}&end=${currentTrack.end}`}
              playing={isPlaying}
              volume={1}
              controls={false}
              width="100%"
              height="100%"
              onProgress={onPlayerProgress}
              onEnded={handleEnded}
              config={{
                youtube: {
                  playerVars: {
                    playsinline: 1,
                    enablejsapi: 1,
                    modestbranding: 1,
                    rel: 0,
                    autoplay: 1,
                    start: currentTrack.start,
                    end: currentTrack.end,
                  },
                },
              }}
            />
          </div>
        </>
      ) : (
        <div>No track selected</div>
      )}
    </div>
  );
}
