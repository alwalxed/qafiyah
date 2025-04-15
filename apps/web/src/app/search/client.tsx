'use client';

import type React from 'react';

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

// Sanitize function to only allow Arabic letters and spaces, max 50 chars
const sanitizeArabicText = (text: string): string => {
  const arabicOnly = text.replace(/[^\u0600-\u06FF\s]/g, '');
  return arabicOnly.slice(0, 50);
};

// Clean response text from HTML tags and non-Arabic characters
const cleanResponseText = (text: string): string => {
  const withoutHtml = text.replace(/<\/?[^>]+(>|$)/g, '');
  return withoutHtml.replace(/[^\u0600-\u06FF\s*]/g, '');
};

export default function SearchClientPage() {
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery } = useNavStore();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { ref, inView } = useInView();

  const query = searchParams.get('q') || searchQuery;

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query, setSearchQuery]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['search-poems', query],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      searchPoems(query, pageParam.toString()),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination?.hasNextPage
        ? Number(lastPage.data.pagination.currentPage) + 1
        : undefined,
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 60,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

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
      const sanitizedQuery = sanitizeArabicText(searchQuery.trim());
      setSearchQuery(sanitizedQuery);
      router.push(`/search?q=${encodeURIComponent(sanitizedQuery)}`);
    }
  };

  return (
    <main className="w-full min-h-screen">
      <div className="max-w-4xl mx-auto px-1">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-2">ابحث في مليون بيت</h1>
        </div>

        {/* Search Form */}
        <div className="mb-10">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl mx-auto"
            dir="rtl"
          >
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-400">
              <Search className="size-5" />
            </div>

            <input
              ref={searchInputRef}
              type="search"
              placeholder="ابحث عن قصائد، شعراء، أو محتوى"
              value={searchQuery}
              onChange={(e) => setSearchQuery(sanitizeArabicText(e.target.value))}
              className="w-full pr-12 pl-12 py-4 text-lg bg-white border border-zinc-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent placeholder:text-zinc-400 transition-all duration-200 [&::-webkit-search-cancel-button]:appearance-none"
              dir="rtl"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleSearchClearClick}
                className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 hover:text-zinc-700 transition-colors duration-200"
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
            <div className="text-center py-16">
              <div className="p-8 rounded-2xl max-w-lg mx-auto">
                <Search className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-zinc-800 mb-2">ابدأ رحلتك الشعرية</h3>
                <p className="text-zinc-500">
                  ابدأ البحث بكتابة كلمتين أو أكثر للعثور على كنوز الشعر العربي
                </p>
              </div>
            </div>
          ) : status === 'pending' && !data ? (
            <div className="flex flex-col justify-center items-center p-16">
              <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
              <p className="text-zinc-500">جاري البحث...</p>
            </div>
          ) : status === 'error' ? (
            <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-100 max-w-lg mx-auto">
              <p className="font-medium mb-1">حدث خطأ أثناء البحث</p>
              <p className="text-red-500 text-sm">يرجى المحاولة مرة أخرى لاحقاً</p>
            </div>
          ) : allResults.length === 0 ? (
            <div className="p-8 text-center max-w-lg mx-auto">
              <X className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-zinc-800 mb-2">لم يتم العثور على نتائج</h3>
              <p className="text-zinc-500">{`لم نتمكن من العثور على نتائج لـ "${sanitizeArabicText(query)}"`}</p>
            </div>
          ) : (
            <>
              <div className="text-right text-zinc-600 mb-4 px-2">
                <span className="bg-zinc-100 px-3 py-1 rounded-full text-sm font-medium">
                  {`   تم العثور على ${toArabicDigits(totalResults)} نتيجة لـ "${sanitizeArabicText(query)}"`}
                </span>
              </div>

              <div className="space-y-3">
                {allResults.map((result) => (
                  <Link
                    href={`/poems/${result.slug}`}
                    key={`page-${result._pageIndex}-item-${result._resultIndex}-id-${result.id}`}
                    className="block bg-white p-5 hover:bg-zinc-50 transition-colors rounded-xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 duration-200"
                  >
                    <div className="text-right">
                      <h2 className="font-bold text-xl text-zinc-900 mb-2">
                        {result.title.replace(/"/g, '')}
                      </h2>
                      <div className="flex justify-end items-center gap-2 text-sm mb-3">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-700">
                          {result.poet_name}
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
                      <p
                        className="text-zinc-700 line-clamp-3 text-right leading-relaxed"
                        dir="rtl"
                      >
                        {cleanResponseText(result.content_snippet.split('*').join(' ** '))}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* Loading more indicator */}
                {hasNextPage && (
                  <div ref={ref} className="p-8 flex justify-center items-center">
                    {isFetchingNextPage ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin h-8 w-8 text-zinc-400 mb-2" />
                        <span className="text-zinc-500 text-sm">جاري تحميل المزيد...</span>
                      </div>
                    ) : (
                      <div className="text-zinc-400 text-sm bg-white px-4 py-2 rounded-full border border-zinc-200">
                        اسحب لتحميل المزيد
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
