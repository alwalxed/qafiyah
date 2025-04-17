'use client';

import { useLayoutStore } from '@/stores/layout-store';
import { getFormattedVersesCount } from '@/utils/texts/get-verse-count';
import { Minus, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import { useEffect, useState } from 'react';

export type PoemProps = {
  clearTitle: string;
  data: {
    poet_name: string;
    poet_slug: string;
    era_name: string;
    era_slug: string;
    meter_name: string;
    theme_name: string;
    type_name?: string;
  };
  verses: string[][];
  verseCount: string | number;
  metadata: Metadata;
};

export function PoemDisplay({ clearTitle, data, verses, verseCount }: PoemProps) {
  const [fontSize, setFontSize] = useState(1); // 1 is the default size multiplier
  const [currentUrl, setCurrentUrl] = useState('');

  const handleTwitterShare = (e: React.MouseEvent) => {
    e.preventDefault();

    const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`;

    window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
  };

  const increaseFontSize = () => {
    if (fontSize < 1.5) setFontSize((prev) => prev + 0.1);
  };

  const decreaseFontSize = () => {
    if (fontSize > 0.7) setFontSize((prev) => prev - 0.1);
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

  const verseCountNum = parseInt(String(verseCount), 10) || 0;

  const { remainingHeight } = useLayoutStore();

  const minHeight = remainingHeight === 0 ? '85svh' : `${remainingHeight}px`;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  return (
    <article
      style={{ minHeight }}
      className="w-full flex justify-center items-center my-14 xs:my-20 lg:my-28"
    >
      <div className="w-full flex flex-col gap-8 justify-center items-center">
        {/* Header */}
        <header className="flex justify-center items-center flex-col gap-4 xxs:gap-6 text-center w-full">
          <div className="flex flex-col gap-2 xx:gap-4">
            <h1 className="text-lg xxs:text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800">
              {clearTitle}
            </h1>

            <h2 className="text-sm xxs:text-base md:text-2xl text-zinc-700">
              <a href={`/poets/${data.poet_slug}/page/1`} className="hover:underline">
                {data.poet_name}
              </a>{' '}
              <a href={`/eras/${data.era_slug}/page/1`} className="hover:underline">
                {`(${data.era_name})`}
              </a>
            </h2>

            <a
              onClick={handleTwitterShare}
              className="flex w-full justify-center items-center mt-1 sm:mt-2"
            >
              <div className="bg-white/5 px-2 lg:px-4 rounded-md border border-zinc-300/60 flex justify-center items-center text-zinc-600 text-[8px] xxs:text-xs md:text-base">
                <p>غردها</p>
              </div>
            </a>
          </div>

          <div className="flex w-full md:w-8/12 border border-zinc-300/80 px-2.5 md:px-8 lg:px-16 text-[10px] xxs:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl justify-between items-center text-zinc-600 rounded-full">
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5 border-l">{data.meter_name || ''}</p>
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5 border-l">
              {`${getFormattedVersesCount(verseCountNum)}` || ''}
            </p>
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5">{data.theme_name || ''}</p>
          </div>
        </header>

        {/* Content */}
        <div className="relative flex flex-col justify-between items-center bg-white gap-4 py-10 md:py-8 lg:py-16 px-4 rounded-2xl w-full md:w-10/12 xl:w-9/12 shadow-[inset_0px_0px_0px_1px_rgba(0,_0,_0,_0.09)]">
          {/* CONTROLLER FOR FONTS */}
          <div className="flex items-center gap-4 border rounded-md border-zinc-300/50 bg-zinc-50/30">
            <button onClick={decreaseFontSize} className="p-1" aria-label="Decrease font size">
              <Minus className="w-3 h-3 md:w-5 md:h-5 xl:w-7 xl:h-7  text-zinc-500/60" />
            </button>
            <p className="text-zinc-500/90 text-[10px] xxs:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl">
              حجم الخط
            </p>
            <button onClick={increaseFontSize} className="p-1" aria-label="Increase font size">
              <Plus className="w-3 h-3 md:w-5 md:h-5 xl:w-7 xl:h-7  text-zinc-500/60" />
            </button>
          </div>

          {/* POEM */}
          <div className="flex flex-col items-center w-full">
            <div className="w-full sm:w-11/12 md:w-10/12 xl:w-6/12">
              {verses.map((verse, index) => (
                <div
                  key={index}
                  className="py-6 md:py-8 border-b border-zinc-50 last:border-b-0 flex flex-col w-full justify-center items-center gap-4"
                  style={{ ...getVerseGap() }}
                >
                  <p
                    className={getVerseFontSize().className}
                    style={getVerseFontSize().style}
                    lang="ar"
                    dir="rtl"
                  >
                    {verse[0]}
                  </p>
                  <p
                    className={getVerseFontSize().className}
                    style={getVerseFontSize().style}
                    lang="ar"
                    dir="rtl"
                  >
                    {verse[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
