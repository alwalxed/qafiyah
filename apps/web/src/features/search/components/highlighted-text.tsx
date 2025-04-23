'use client';

import { cn } from '@/lib/utils';
import { Fragment } from 'react';

type Props = {
  text: string;
  className?: string;
};

export function HighlightedText({ text, className = '' }: Props) {
  const parts = text.split(/<\/?mark>/);

  const processedParts = parts.map((part, index) => {
    const isHighlighted = index % 2 === 1;

    const segments = part.split('*');

    return (
      <Fragment key={index}>
        {segments.map((segment, segIndex) => (
          <Fragment key={`${index}-${segIndex}`}>
            {segIndex > 0 && <span className="inline-block mx-2">{`—`}</span>}
            {isHighlighted ? <span className="text-red-400 font-medium">{segment}</span> : segment}
          </Fragment>
        ))}
      </Fragment>
    );
  });

  return (
    <div className={cn('highlighted-text', className)} dir="rtl" style={{ userSelect: 'text' }}>
      {processedParts}
    </div>
  );
}
