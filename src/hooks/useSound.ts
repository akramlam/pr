import { useCallback } from 'react';

const sounds = {
  correct: new Audio('/sounds/correct.mp3'),
  wrong: new Audio('/sounds/wrong.mp3'),
  timeout: new Audio('/sounds/timeout.mp3'),
  click: new Audio('/sounds/click.mp3')
};

export function useSound() {
  const play = useCallback((sound: keyof typeof sounds) => {
    const audio = sounds[sound];
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  }, []);

  return { play };
}