// src/hooks/useProgressBar.ts
import { useLayoutEffect } from 'react';

export function useProgressBar(ref: React.RefObject<HTMLInputElement | null>, progressValue: number) {
  useLayoutEffect(() => {
    const progressBar = ref.current;
    if (!progressBar) return;

    const value = Number(progressBar.value);
    const max = Number(progressBar.max);
    const percent = (value / max) * 100;
    progressBar.style.backgroundImage =
      `linear-gradient(to right, #22d3ee ${percent}%, #475569 ${percent}%)`;
  }, [ref, progressValue]);
}