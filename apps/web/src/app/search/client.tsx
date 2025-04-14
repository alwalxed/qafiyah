'use client';

import { searchPoems } from '@/lib/api/queries';
import { responsiveIconSize } from '@/lib/constants';
import { toArabicDigits } from '@/lib/utils';
import { useNavStore } from '@/store/nav-store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export default function SearchClientPage() {
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery } = useNavStore();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { ref, inView } = useInView();

  // Get query from URL or store
  const query = searchParams.get('q') || searchQuery;

  // Update the search store when the URL query changes
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query, setSearchQuery]);

  // Fetch search results
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['search-poems', query],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      searchPoems(query, pageParam.toString()),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination?.hasNextPage
        ? Number(lastPage.data.pagination.currentPage) + 1
        : undefined,
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 1,
  });

  // Load more results when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Create a flattened array of results with page information to ensure unique keys
  const allResults =
    data?.pages.flatMap((page, pageIndex) =>
      page.data.results.map((result, resultIndex) => ({
        ...result,
        _pageIndex: pageIndex,
        _resultIndex: resultIndex,
      }))
    ) || [];

  const totalResults = data?.pages[0]?.data.pagination.totalResults || 0;

  const handleSearchClearClick = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-red-200">
      <h1>ابحث في تسعين ألف قصيدة</h1>
      <div className="mb-6">
        <form ref={formRef} onSubmit={handleSubmit} className="relative w-full" dir="rtl">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
            <Search className="size-5" />
          </div>

          <input
            ref={searchInputRef}
            type="search"
            placeholder="ابحث عن قصائد، شعراء، أو محتوى"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-10 py-3 text-lg bg-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none"
            dir="rtl"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleSearchClearClick}
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 hover:text-zinc-700"
              aria-label="مسح البحث"
            >
              <X className={responsiveIconSize} />
            </button>
          )}
        </form>
      </div>

      {/* Search results */}
      <div className="mt-6">
        {query.length <= 1 ? (
          <div className="text-center text-zinc-500 mt-10">ابدأ البحث بكتابة كلمتين أو أكثر</div>
        ) : status === 'pending' && !data ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin h-8 w-8 text-zinc-500" />
          </div>
        ) : status === 'error' ? (
          <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
            حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.
          </div>
        ) : allResults.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 bg-zinc-50 rounded-lg">
            لم يتم العثور على نتائج لـ "{query}"
          </div>
        ) : (
          <>
            <div className="text-right text-zinc-600 mb-4">
              تم العثور على {toArabicDigits(totalResults)} نتيجة لـ "{query}"
            </div>

            <div className="divide-y divide-zinc-100">
              {allResults.map((result) => (
                <Link
                  href={`/poems/${result.slug}`}
                  key={`page-${result._pageIndex}-item-${result._resultIndex}-id-${result.id}`}
                  className="block p-4 hover:bg-zinc-50 transition-colors rounded-lg"
                >
                  <div className="text-right">
                    <h2 className="font-semibold text-zinc-900 mb-1">{result.title}</h2>
                    <div className="flex justify-end items-center gap-2 text-sm text-zinc-600 mb-2">
                      <span>{result.poet_name}</span>
                      {result.meter_name && (
                        <>
                          <span className="text-zinc-400">•</span>
                          <span>{result.meter_name}</span>
                        </>
                      )}
                      {result.era_name && (
                        <>
                          <span className="text-zinc-400">•</span>
                          <span>{result.era_name}</span>
                        </>
                      )}
                    </div>
                    <p className="text-zinc-700 text-sm line-clamp-3 text-right" dir="rtl">
                      {result.content_snippet}
                    </p>
                  </div>
                </Link>
              ))}

              {/* Loading more indicator */}
              {hasNextPage && (
                <div ref={ref} className="p-4 flex justify-center items-center">
                  {isFetchingNextPage ? (
                    <Loader2 className="animate-spin h-6 w-6 text-zinc-400" />
                  ) : (
                    <span className="text-zinc-400 text-sm">اسحب لتحميل المزيد</span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
