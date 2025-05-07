'use client';

import { getRandomSlug } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';

export function useRandomPoemSlug() {
  const {
    data: slug,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<string>({
    queryKey: ['random-poem-slug'],
    queryFn: getRandomSlug,
    retry: 2,
    staleTime: 1000 * 60 * 60 * 24 * 30, // 1 month
    enabled: false, // This prevents automatic fetching
  });

  const fetchRandomSlug = async () => {
    return refetch();
  };

  return {
    slug,
    isLoading: isLoading || isFetching, // Combined loading state
    fetchRandomSlug,
  };
}
