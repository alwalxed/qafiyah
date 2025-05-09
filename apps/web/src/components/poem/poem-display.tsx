'use client';

import { useFontSize } from '@/hooks/use-font-size';
import { useTweetUrl } from '@/hooks/use-tweet-url';
import type { PoemMetadata, RelatedPoems } from '@/lib/api/types';
import { getFormattedVersesCount } from '@/utils/texts/get-verse-count';
import { Minus, Plus } from 'lucide-react';
import { ListCard } from '../ui/list-card';

export type PoemProps = {
  clearTitle: string;
  metadata: PoemMetadata;
  verses: string[][];
  verseCount: string | number;
  relatedPoems: RelatedPoems[] | undefined;
};

export function PoemDisplay({ clearTitle, metadata, verses, verseCount, relatedPoems }: PoemProps) {
  const { decreaseFontSize, increaseFontSize, getVerseFontSize, getVerseGap } = useFontSize();
  const { handleTwitterShare } = useTweetUrl();
  const verseCountNum = parseInt(String(verseCount), 10) || 0;

  return (
    <div className="w-full flex justify-center items-start my-14 xs:my-20 lg:my-28">
      <div className="w-full flex flex-col gap-10 justify-center items-center">
        {/* Header */}
        <header className="flex justify-center items-center flex-col gap-4 xxs:gap-6 text-center w-full">
          <div className="flex flex-col gap-2 xx:gap-4">
            <h1 className="text-lg xxs:text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800">
              {clearTitle}
            </h1>

            <h2 className="text-sm xxs:text-base md:text-2xl text-zinc-700">
              <a href={`/poets/${metadata.poet_slug}/page/1`} className="hover:underline">
                {metadata.poet_name}
              </a>{' '}
              <a href={`/eras/${metadata.era_slug}/page/1`} className="hover:underline">
                {`(${metadata.era_name})`}
              </a>
            </h2>

            <a
              onClick={handleTwitterShare}
              className="flex w-full justify-center items-center mt-1 sm:mt-2 cursor-pointer"
            >
              <div className="bg-white/5 px-2 lg:px-4 rounded-md border border-zinc-300/60 flex justify-center items-center text-zinc-600 text-[8px] xxs:text-xs md:text-base">
                <p>غرد</p>
              </div>
            </a>
          </div>

          <div className="flex w-full md:w-8/12 border border-zinc-300/80 px-2.5 md:px-8 lg:px-16 text-[10px] xxs:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl justify-between items-center text-zinc-600 rounded-full">
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5 border-l">{metadata.meter_name || ''}</p>
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5 border-l">
              {`${getFormattedVersesCount(verseCountNum)}` || ''}
            </p>
            <p className="flex-1 py-0.5 md:py-1 lg:py-1.5">{metadata.theme_name || ''}</p>
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
          <article className="flex flex-col items-center w-full">
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
          </article>
        </div>

        <div className="w-full md:w-10/12 xl:w-9/12 flex flex-col gap-6 py-6 xl:gap-8 xl:py-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg xxs:text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold">
              استزد
            </h3>
            <p className="text-xs md:text-sm xl:text-base font-normal text-zinc-600">
              عشر قصائد مشابهة
            </p>
          </div>
          <div className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-2 sm:gap-4 2xl:gap-6">
            {relatedPoems && relatedPoems.length > 0 ? (
              relatedPoems.map((item: RelatedPoems) => {
                return (
                  <ListCard
                    className="rounded-2xl"
                    key={`${item.poem_slug} ${metadata.poet_slug}`}
                    title={item.poet_name}
                    href={`/poems/${item.poem_slug}`}
                    name={item.poem_title}
                  />
                );
              })
            ) : (
              <div className="text-red-500 text-center py-8">
                حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
