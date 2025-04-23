'use client';

import { cn } from '@/lib/utils';
import type { JSX } from 'react';

type Props = {
  text: string;
  className?: string;
};

export function HighlightedText({ text, className = '' }: Props) {
  const filterArabicText = (text: string): string => {
    return text.replace(
      /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s.,،؛:!؟*()[\]{}|/\\-]/g,
      ''
    );
  };

  // First split text by '*' to get lines
  const lines = text.split('*');
  const result: JSX.Element[] = [];
  let key = 0;

  // Process each line
  lines.forEach((line, lineIndex) => {
    // Split each line by mark tags
    const parts = line.split(/(<mark>|<\/mark>)/g);
    const lineResult: JSX.Element[] = [];
    let isHighlighted = false;

    // Process parts within each line
    parts.forEach((part) => {
      if (part === '<mark>') {
        isHighlighted = true;
      } else if (part === '</mark>') {
        isHighlighted = false;
      } else if (part) {
        const filteredText = filterArabicText(part);

        if (filteredText) {
          if (isHighlighted) {
            lineResult.push(
              <span key={key++} className={cn('text-red-400 font-medium', className)}>
                {filteredText}
              </span>
            );
          } else {
            lineResult.push(<span key={key++}>{filteredText}</span>);
          }
        }
      }
    });

    // Add the processed line to results
    if (lineResult.length > 0) {
      result.push(
        <div key={`line-${lineIndex}`} className="line">
          {lineResult}
        </div>
      );

      // Add separator between lines, except for the last line
      if (lineIndex < lines.length - 1) {
        result.push(
          <span key={`separator-${lineIndex}`} className="line-separator">
            {' — '}
          </span>
        );
      }
    }
  });

  return (
    <div className={cn('highlighted-text', className)} style={{ userSelect: 'text' }}>
      {result}
    </div>
  );
}
