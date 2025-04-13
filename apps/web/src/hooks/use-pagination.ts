'use client';

import { FETCH_PER_PAGE } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UsePaginationProps = {
  totalItems?: number;
  currentPage: number;
  slug?: string;
};

export function usePagination({ totalItems = 0, currentPage, slug }: UsePaginationProps) {
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(1);

  // Calculate total pages when totalItems changes
  useEffect(() => {
    const newTotalPages = Math.ceil(totalItems / FETCH_PER_PAGE);
    setTotalPages(newTotalPages || 1);
  }, [totalItems]);

  // Validate page number and redirect if invalid
  useEffect(() => {
    // Check if page is invalid
    if (isNaN(currentPage) || currentPage < 1) {
      router.push('/404');
      return;
    }

    // Check if page is greater than total pages (and we have data)
    if (totalItems > 0 && currentPage > totalPages) {
      router.push('/404');
    }
  }, [currentPage, totalPages, totalItems, router]);

  // Fix URL construction for pagination
  const nextPageUrl = slug ? `/${slug}/page/${currentPage + 1}` : `/page/${currentPage + 1}`;

  const prevPageUrl = slug ? `/${slug}/page/${currentPage - 1}` : `/page/${currentPage - 1}`;

  return {
    totalPages,
    isFirstPage: currentPage <= 1,
    isLastPage: currentPage >= totalPages,
    nextPageUrl,
    prevPageUrl,
  };
}
