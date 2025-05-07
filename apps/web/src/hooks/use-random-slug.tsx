'use client';

import { getRandomSlug } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useRandomPoem() {
  const router = useRouter();
  const [hasClicked, setHasClicked] = useState(false);

  const { isLoading, isFetching, isError, error, refetch } = useQuery<string>({
    queryKey: ['random-poem-slug'],
    queryFn: getRandomSlug,
    enabled: false,
    retry: 2,
    staleTime: 1000 * 60 * 60 * 24 * 30, // 1 month
  });

  const handleClick = async () => {
    if (isLoading || isFetching) return; // Prevent multiple triggers
    setHasClicked(true);
    const result = await refetch();

    if (result.data) {
      try {
        router.push(`/poems/${result.data}`);
      } catch (navErr) {
        console.error('Navigation error:', navErr);
      }
    } else if (!result.error) {
      console.warn('Refetch returned no data and no error.');
    }
  };

  return {
    handleClick,
    isLoading: isLoading || isFetching,
    isError: hasClicked && isError,
    error,
  };
}
