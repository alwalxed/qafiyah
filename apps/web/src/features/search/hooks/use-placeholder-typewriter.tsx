'use client';

import { useTypingEffect } from '@/hooks/use-typing-effect';
import { getRandomLine } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

export function usePlaceholderTypewriter() {
  const { data: content = '' } = useQuery<string>({
    queryKey: ['random-line'],
    queryFn: getRandomLine,
    retry: 2,
    staleTime: 60 * 60 * 1000 * 24 * 30, // 1 month
  });

  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    if (content) {
      setCurrentContent(content);
    }
  }, [content]);

  const {
    text: typedText,
    isActive,
    start,
    stop,
    reset,
  } = useTypingEffect({
    text: currentContent,
    options: { loop: true, loopDelay: 7 * 1000 },
  });

  useEffect(() => {
    if (currentContent) {
      reset();
    }
  }, [currentContent, reset]);

  const toggleTimerRef = useRef<number | null>(null);

  const clearToggleTimer = useCallback(() => {
    if (toggleTimerRef.current !== null) {
      window.clearTimeout(toggleTimerRef.current);
      toggleTimerRef.current = null;
    }
  }, []);

  const handleTypingEffect = useCallback(
    (shouldActivate: boolean) => {
      clearToggleTimer();

      if (shouldActivate) {
        stop();
        toggleTimerRef.current = window.setTimeout(() => {
          start(true);
        }, 300);
      } else {
        stop();
      }
    },
    [start, stop, clearToggleTimer]
  );

  useEffect(() => {
    return clearToggleTimer;
  }, [clearToggleTimer]);

  return {
    isTypingActive: isActive,
    effectText: isActive ? typedText : '',
    handleTypingEffect,
  };
}
