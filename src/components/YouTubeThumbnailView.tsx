import type { JSX } from 'astro/jsx-runtime';
import React, { useState } from 'react';

export interface YouTubeThumbnailViewProps {
  videoId: string;
  width?: number;
  height?: number;
  quality?: 'max' | 'high' | 'medium' | 'default';
}

const qualityMap: Record<'max' | 'high' | 'medium' | 'default', string> = {
  max: 'maxresdefault.jpg',
  high: 'hqdefault.jpg',
  medium: 'mqdefault.jpg',
  default: 'default.jpg'
};

// フォールバック順序を定義
const fallbackOrder: Record<'max' | 'high' | 'medium' | 'default', ('max' | 'high' | 'medium' | 'default')[]> = {
  max: ['max', 'high', 'medium', 'default'],
  high: ['high', 'medium', 'default'],
  medium: ['medium', 'default'],
  default: ['default']
};

function YouTubeThumbnailView({
  videoId,
  width = 320,
  height = 180,
  quality = 'max'
}: YouTubeThumbnailViewProps): JSX.Element {
  // quality prop に基づいたフォールバック順序
  const order = fallbackOrder[quality];
  const [currentQualityIndex, setCurrentQualityIndex] = useState(0);
  const initialQualityKey = order[currentQualityIndex];
  const [src, setSrc] = useState(`https://img.youtube.com/vi/${videoId}/${qualityMap[initialQualityKey]}`);
  const handleError = () => {
    // フォールバック順序内で次の画質があれば更新
    if (currentQualityIndex < order.length - 1) {
      const nextQualityKey = order[currentQualityIndex + 1];
      setCurrentQualityIndex(currentQualityIndex + 1);
      setSrc(`https://img.youtube.com/vi/${videoId}/${qualityMap[nextQualityKey]}`);
    }
  };

  return (
    <img
      src={src}
      alt={`YouTube Thumbnail for video ${videoId}`}
      width={width}
      height={height}
      style={{ objectFit: 'cover' }}
      onError={handleError}
    />
  );
};

export default YouTubeThumbnailView;