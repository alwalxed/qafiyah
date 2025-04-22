import { useEffect, useRef, useState } from 'react';
import { joinCommaSeparated, splitCommaSeparated } from '../utils/helpers';
import { useInfiniteSearch } from './use-infinite-search';

export function useSearch() {
  const [inputValue, setInputValue] = useState('');

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    search,
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    searchParams,
    searchType,
    isFetching,
    pagination,
  } = useInfiniteSearch({
    initialMatchType: 'all',
    initialSearchType: 'poems',
    queryKey: 'search',
  });

  useEffect(() => {
    if (loadMoreRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );

      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Initialize input value from URL on first load
  useEffect(() => {
    if (searchParams.q) {
      setInputValue(searchParams.q);
    }
  }, [searchParams.q]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      search({
        q: inputValue,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchTypeChange = (value: string) => {
    const newSearchType = value as 'poems' | 'poets';

    // If search type is changing, reset everything
    if (newSearchType !== searchParams.search_type) {
      // Clear input value
      setInputValue('');

      // Reset filters that don't apply to the new search type
      if (newSearchType === 'poets') {
        search({
          q: '',
          search_type: newSearchType,
          meter_ids: '',
          theme_ids: '',
        });
      } else {
        search({
          q: '',
          search_type: newSearchType,
        });
      }
    } else if (inputValue.trim()) {
      // Just update the search type if we have a query
      search({
        search_type: newSearchType,
      });
    }
  };

  const handleMatchTypeChange = (value: string) => {
    if (['all', 'any', 'exact'].includes(value)) {
      search({
        match_type: value as 'all' | 'any' | 'exact',
      });
    }
  };

  const handleErasChange = (value: string | string[]) => {
    const newSelectedEras = value as string[];
    search({
      era_ids: joinCommaSeparated(newSelectedEras),
    });
  };

  const handleMetersChange = (value: string | string[]) => {
    const newSelectedMeters = value as string[];
    search({
      meter_ids: joinCommaSeparated(newSelectedMeters),
    });
  };

  const handleThemesChange = (value: string | string[]) => {
    const newSelectedThemes = value as string[];
    search({
      theme_ids: joinCommaSeparated(newSelectedThemes),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectedEras = splitCommaSeparated(searchParams.era_ids);
  const selectedMeters = splitCommaSeparated(searchParams.meter_ids);
  const selectedThemes = splitCommaSeparated(searchParams.theme_ids);

  return {
    // states
    inputValue,
    setInputValue,

    // obs
    observer,
    loadMoreRef,

    // react-query
    search,
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    searchParams,
    searchType,
    isFetching,
    pagination,

    // submit handlers
    handleSearch,

    // change handlers
    handleInputChange,
    handleSearchTypeChange,
    handleMatchTypeChange,
    handleErasChange,
    handleMetersChange,
    handleThemesChange,

    // keys handlers
    handleKeyDown,

    // vals
    selectedEras,
    selectedMeters,
    selectedThemes,
  };
}
