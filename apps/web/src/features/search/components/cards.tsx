import { Badge } from '@/components/shadcn/badge';
import { Card, CardContent } from '@/components/shadcn/card';
import { SITE_URL } from '@/constants/GLOBALS';
import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { toArabicDigits } from 'to-arabic-digits';
import { HighlightedText } from './highlighted-text';

export function PoemCard({
  item: { poem_meter, poem_slug, poem_snippet, poem_title, poet_era, poet_name, poet_slug },
}: {
  item: PoemsSearchResult;
}) {
  return (
    <Card className="shadow-xs shadow-zinc-100 group overflow-hidden border-zinc-300/80 hover:border-zinc-200 transition-all duration-300 bg-white">
      <a href={`${SITE_URL}/poems/${poem_slug}`} className="block">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-medium text-zinc-800 group-hover:text-zinc-900 transition-colors">
                {poem_title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-lg font-medium text-zinc-700 hover:text-zinc-900"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `${SITE_URL}/poets/${poet_slug}`;
                    }}
                  >
                    {poet_name || 'شاعر'}
                  </span>
                </div>

                <div className="flex justify-center items-center gap-2">
                  {poem_meter && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-200"
                    >
                      {poem_meter.split(' ')[0]}
                    </Badge>
                  )}
                  {poet_era && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-200"
                    >
                      {poet_era.split(' ')[0] || 'عصر غير معروف'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <HighlightedText className="text-3xl font-normal" text={poem_snippet} />
          </div>
        </CardContent>
      </a>
    </Card>
  );
}

export function PoetCard({
  item: { poet_bio, poet_era, poet_name, poet_slug, relevance },
}: {
  item: PoetsSearchResult;
}) {
  return (
    <Card className="group overflow-hidden border-zinc-100 hover:border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <a href={`${SITE_URL}/poets/${poet_slug}/page/1`} className="block">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-zinc-800 group-hover:text-zinc-900 transition-colors">
                {poet_name || 'شاعر'}
              </h2>

              {poet_era && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal text-zinc-600 border-zinc-200 bg-zinc-50"
                >
                  {poet_era || 'عصر غير معروف'}
                </Badge>
              )}
            </div>

            {poet_bio && (
              <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2">{poet_bio}</p>
            )}

            <div className="flex justify-end pt-1">
              <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-0">
                {toArabicDigits(relevance || 0)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
