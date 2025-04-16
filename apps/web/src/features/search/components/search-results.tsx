'use client';

import { toArabicDigits } from '@/lib/utils';
import { cleanSearchResponseText } from '@/utils/clean-search-response-text';
import { sanitizeArabicText } from '@/utils/sanitize-arabic-text';
import { Loader2 } from 'lucide-react';
import type { SearchResult } from '../hooks/use-poem-search';
import { useTextHighlighter } from '../hooks/use-text-highlighter';

type SearchResultsHeaderProps = {
  totalResults: number;
  query: string;
};

export function SearchResultsHeader({ totalResults, query }: SearchResultsHeaderProps) {
  return (
    <div className="text-right text-zinc-600 mb-4 px-2">
      <span className="bg-zinc-100 px-3 py-1 rounded-full text-sm font-medium">
        {`عثر على ${toArabicDigits(totalResults)} نتيجة لـ "${sanitizeArabicText(query)}"`}
      </span>
    </div>
  );
}

type SearchResultItemProps = {
  result: SearchResult;
  searchQuery: string;
};

export function SearchResultItem({ result, searchQuery }: SearchResultItemProps) {
  const { highlightMatches } = useTextHighlighter();

  return (
    <a
      href={`/poems/${result.slug}`}
      key={`page-${result._pageIndex}-item-${result._resultIndex}-id-${result.id}`}
      className="block bg-white p-5 hover:bg-zinc-50 transition-colors rounded-xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 duration-200"
    >
      <div className="text-right">
        <h2 className="font-bold text-xl text-zinc-900 mb-2">
          {highlightMatches(result.title.replace(/"/g, ''), searchQuery)}
        </h2>
        <div className="flex justify-end items-center gap-2 text-sm mb-3">
          <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-700">
            {highlightMatches(result.poet_name, searchQuery)}
          </span>
          {result.meter_name && (
            <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-700">
              {result.meter_name}
            </span>
          )}
          {result.era_name && (
            <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-700">
              {result.era_name}
            </span>
          )}
        </div>
        <p className="text-zinc-700 line-clamp-3 text-right leading-relaxed" dir="rtl">
          {highlightMatches(
            cleanSearchResponseText(result.content_snippet.split('*').join(' — ')),
            searchQuery
          )}
        </p>
      </div>
    </a>
  );
}

type LoadMoreProps = {
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null | undefined) => void;
};

export function LoadMore({ isFetchingNextPage, loadMoreRef }: LoadMoreProps) {
  return (
    <div ref={loadMoreRef} className="p-8 flex justify-center items-center">
      {isFetchingNextPage ? (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-8 w-8 text-zinc-400 mb-2" />
          <span className="text-zinc-500 text-sm">جار تحميل المزيد...</span>
        </div>
      ) : (
        <div className="text-zinc-400 text-sm bg-white px-4 py-2 rounded-full border border-zinc-200">
          اسحب لتحميل المزيد
        </div>
      )}
    </div>
  );
}

type SearchResultsListProps = {
  allResults: SearchResult[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null | undefined) => void;
  totalResults: number;
  query: string;
};

export function SearchResultsList({
  allResults,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  totalResults,
  query,
}: SearchResultsListProps) {
  return (
    <>
      <SearchResultsHeader totalResults={totalResults} query={query} />

      <div className="space-y-3">
        {allResults.map((result) => (
          <SearchResultItem
            key={`page-${result._pageIndex}-item-${result._resultIndex}-id-${result.id}`}
            result={result}
            searchQuery={query}
          />
        ))}

        {/* Loading more indicator */}
        {hasNextPage && (
          <LoadMore isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
        )}
      </div>
    </>
  );
}
