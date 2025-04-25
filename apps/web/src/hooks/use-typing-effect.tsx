'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  typingSpeed?: number;
  loop?: boolean;
  loopDelay?: number;
};

export function useTypingEffect({ text, options = {} }: { text: string; options?: Options }) {
  const { typingSpeed = 100, loop = false, loopDelay = 1500 } = options;

  const [displayText, setDisplayText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive || !text) {
      clearTimer();
      return;
    }

    const typeNext = () => {
      if (indexRef.current < text.length) {
        setDisplayText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        timerRef.current = window.setTimeout(typeNext, typingSpeed);
      } else if (loop) {
        timerRef.current = window.setTimeout(() => {
          indexRef.current = 0;
          setDisplayText('');
          timerRef.current = window.setTimeout(typeNext, typingSpeed);
        }, loopDelay);
      } else {
        setIsActive(false);
      }
    };

    timerRef.current = window.setTimeout(typeNext, typingSpeed);

    return clearTimer;
  }, [isActive, text, typingSpeed, loop, loopDelay, clearTimer]);

  const start = useCallback(
    (fromBeginning = true) => {
      clearTimer();
      if (fromBeginning) {
        indexRef.current = 0;
        setDisplayText('');
      }
      setIsActive(true);
    },
    [clearTimer]
  );

  const stop = useCallback(() => {
    clearTimer();
    setIsActive(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    start(true);
  }, [start]);

  return { text: displayText, isActive, start, stop, reset };
}
