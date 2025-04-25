import { Badge } from '@/components/shadcn/badge';
import { SITE_URL } from '@/constants/GLOBALS';
import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { HighlightedText } from './highlighted-text';

const badgeClassname =
  'text-[11px] lg:text-sm font-normal text-zinc-600/90 shadow-none border-0 ring-none bg-zinc-50';

export function PoemCard({
  item: { poem_meter, poem_slug, poem_snippet, poem_title, poet_era, poet_name, poet_slug },
}: {
  item: PoemsSearchResult;
}) {
  return (
    <div className="shadow-none group overflow-hidden border-0 ring-1 ring-zinc-300/50 hover:border-zinc-200 transition-all duration-300 bg-white rounded-xl flex justify-center items-center p-4 md:p-6">
      <div className="flex flex-col w-full h-full gap-4">
        {/*  */}
        <div className="flex flex-col gap-1.5">
          <a
            href={`${SITE_URL}/poems/${poem_slug}`}
            className="text-base md:text-lg 2xl:text-xl font-bold text-zinc-900 group-hover:text-zinc-900 transition-colors hover:underline hover:underline-offset-4"
          >
            {poem_title}
          </a>

          <a
            href={`${SITE_URL}/poets/${poet_slug}/page/1`}
            className="text-base md:text-lg hover:cursor-pointer font-normal text-zinc-900/80 hover:text-zinc-900 hover:underline hover:underline-offset-4"
          >
            {poet_name || 'شاعر'}
          </a>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <HighlightedText
            className="text-sm sm:text-base md:text-lg font-normal text-zinc-900"
            text={poem_snippet}
          />
          <div className="flex justify-end items-center gap-1">
            {poem_meter && (
              <Badge variant="outline" className={badgeClassname}>
                {poem_meter.split(' ')[0]}
              </Badge>
            )}
            {poet_era && (
              <Badge variant="outline" className={badgeClassname}>
                {poet_era.split(' ')[0] || 'عصر غير معروف'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PoetCard({
  item: { poet_era, poet_name, poet_slug },
}: {
  item: PoetsSearchResult;
}) {
  return (
    <div className="shadow-none group overflow-hidden border-0 ring-1 ring-zinc-300/50 hover:border-zinc-200 transition-all duration-300 bg-white rounded-xl flex justify-center items-center p-4 md:p-6">
      <a
        className="flex flex-row justify-between items-centers gap-2 w-full "
        href={`${SITE_URL}/poets/${poet_slug}/page/1`}
      >
        <h2 className="flex-1 text-base md:text-lg 2xl:text-xl font-bold text-zinc-900 group-hover:text-zinc-900 transition-colors  hover:underline hover:underline-offset-4">
          {poet_name || 'شاعر'}
        </h2>

        <div className="flex justify-center items-center">
          {poet_era && (
            <Badge variant="outline" className={badgeClassname}>
              {poet_era || 'عصر غير معروف'}
            </Badge>
          )}
        </div>
      </a>
    </div>
  );
}
