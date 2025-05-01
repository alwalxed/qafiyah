'use client';

import { useState } from 'react';

export function useFontSize(minSize = 0.7, maxSize = 1.5, initialSize = 1) {
  const [fontSize, setFontSize] = useState(initialSize);

  const increaseFontSize = () => {
    if (fontSize < maxSize) setFontSize((prev) => prev + 0.1);
  };

  const decreaseFontSize = () => {
    if (fontSize > minSize) setFontSize((prev) => prev - 0.1);
  };

  // Calculate the dynamic font size classes based on the fontSize state
  const getVerseFontSize = () => {
    const baseClasses = 'text-base xxs:text-lg xs:text-xl sm:text-2xl md:text-2xl';
    const scaleStyle = { transform: `scale(${fontSize})`, transformOrigin: 'center' };
    return { className: baseClasses, style: scaleStyle };
  };

  const getVerseGap = () => {
    // Base gap is 1rem (16px), scale it with the font size
    const gapSize = 1 * fontSize * 16;
    return { gap: `${gapSize}px` };
  };

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    getVerseFontSize,
    getVerseGap,
  };
}
