// 時間関連のユーティリティ関数をまとめる

export const parseTimeToSeconds = (time: string | number): number => {
  if (typeof time === 'number') return time;
  const parts = time.split(':').map(Number).reverse();
  return parts.reduce((acc, part, i) => acc + part * 60 ** i, 0);
};

export const formatSeconds = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return [m, s].map(v => String(v).padStart(2, '0')).join(':');
};