import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { Loader2 } from 'lucide-react';
import type { Ref } from 'react';
import { PoemCard, PoetCard } from './result-cards';
import { ErrorState } from './state-error';
import { LoadingState } from './state-loading';
import { NoResultsState } from './state-no-results';

type Props = {
  data: (PoemsSearchResult | PoetsSearchResult)[];
  loadMoreRef: Ref<HTMLDivElement>;

  isError: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isSuccess: boolean;

  inputValue: string;
  searchType: string;
  errorMessageText: string;
  refreshThePageText: string;
  noResultsFoundText: string;
  resultTextText: string;
};

export function SearchResults({
  data,
  loadMoreRef,

  isError,
  isFetchingNextPage,
  isLoading,
  isSuccess,

  inputValue,
  searchType,
  errorMessageText,
  refreshThePageText,
  noResultsFoundText,
  resultTextText,
}: Props) {
  if (isError) {
    return (
      <ErrorState errorMessageText={errorMessageText} refreshThePageText={refreshThePageText} />
    );
  }

  if (inputValue && !isLoading && data.length === 0 && isSuccess) {
    return <NoResultsState noResultsFoundText={noResultsFoundText} />;
  }

  if (isLoading && !isFetchingNextPage) {
    return <LoadingState />;
  }
  return (
    <div className="space-y-3">
      {/* Tiny Result Counts */}
      {data.length > 0 && (
        <div className="w-full flex justify-start items-start">
          <span className="bg-zinc-50 py-0.5 px-3 rounded-md ring-1 ring-zinc-300/30">
            <p className="text-sm md:text-base font-normal">{resultTextText}</p>
          </span>
        </div>
      )}

      {searchType === 'poems' &&
        (data as PoemsSearchResult[]).map((item, index) => (
          <PoemCard
            key={`slug-${item.poem_slug}-relevance-${item.relevance}-index-${index}`}
            item={item}
          />
        ))}

      {searchType === 'poets' &&
        (data as PoetsSearchResult[]).map((item, index) => (
          <PoetCard
            key={`slug-${item.poet_slug}-relevance-${item.relevance}-index-${index}`}
            item={item}
          />
        ))}

      {data.length > 0 && (
        <div ref={loadMoreRef} className="h-32 flex justify-center items-center">
          {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />}
        </div>
      )}
    </div>
  );
}
