import { useEffect, useRef, useState } from 'react';
import { joinCommaSeparated, splitCommaSeparated } from '../utils/helpers';
import { useInfiniteSearch } from './use-infinite-search';

export function useSearch() {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    isError,
    isLoading,
    isFetchingNextPage,
    isSuccess,
    hasNextPage,

    searchParams,
    searchType,

    data,
    error,

    fetchNextPage,
    performSearch,
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
      performSearch({
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
        performSearch({
          q: '',
          search_type: newSearchType,
          meter_ids: '',
          theme_ids: '',
        });
      } else {
        performSearch({
          q: '',
          search_type: newSearchType,
        });
      }
    } else if (inputValue.trim()) {
      // Just update the search type if we have a query
      performSearch({
        search_type: newSearchType,
      });
    }
  };

  const handleMatchTypeChange = (value: string) => {
    if (['all', 'any', 'exact'].includes(value)) {
      performSearch({
        match_type: value as 'all' | 'any' | 'exact',
      });
    }
  };

  const handleErasChange = (value: string | string[]) => {
    const newSelectedEras = value as string[];
    performSearch({
      era_ids: joinCommaSeparated(newSelectedEras),
    });
  };

  const handleRhymesChange = (value: string | string[]) => {
    const newSelectedRhymes = value as string[];
    performSearch({
      rhyme_ids: joinCommaSeparated(newSelectedRhymes),
    });
  };

  const handleMetersChange = (value: string | string[]) => {
    const newSelectedMeters = value as string[];
    performSearch({
      meter_ids: joinCommaSeparated(newSelectedMeters),
    });
  };

  const handleThemesChange = (value: string | string[]) => {
    const newSelectedThemes = value as string[];
    performSearch({
      theme_ids: joinCommaSeparated(newSelectedThemes),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectedEras = splitCommaSeparated(searchParams.era_ids);
  const selectedRhymes = splitCommaSeparated(searchParams.rhyme_ids);
  const selectedMeters = splitCommaSeparated(searchParams.meter_ids);
  const selectedThemes = splitCommaSeparated(searchParams.theme_ids);

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  // Add a validation function after handleSearch
  const validateInput = (input: string, type: 'poems' | 'poets'): string | null => {
    // Check for Arabic characters only
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (!arabicRegex.test(input)) {
      return 'يرجى إدخال كلمات باللغة العربية فقط';
    }

    // Split input into words (trim and filter empty strings)
    const words = input
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (type === 'poems') {
      // For poems: minimum two words, each at least two letters
      if (words.length < 2) {
        return 'يجب إدخال كلمتين على الأقل للبحث في القصائد';
      }

      const shortWords = words.filter((word) => word.length < 2);
      if (shortWords.length > 0) {
        return 'يجب أن تكون كل كلمة مكونة من حرفين على الأقل';
      }
    } else {
      // For poets: minimum one word, at least two letters
      if (words.length < 1) {
        return 'يجب إدخال كلمة واحدة على الأقل للبحث عن شاعر';
      }

      if (words[0].length < 2) {
        return 'يجب أن تكون الكلمة مكونة من حرفين على الأقل';
      }
    }

    return null;
  };

  // Custom handlers that wrap the original handlers
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    // Clear validation error when input changes after submission
    if (hasSubmitted) {
      setValidationError(null);
    }
  };

  const handleCustomSearchTypeChange = (value: string) => {
    handleSearchTypeChange(value);
    // Clear validation errors when search type changes
    setValidationError(null);
    setHasSubmitted(false);
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Validate before allowing the original handler to proceed
      const error = validateInput(inputValue, searchType);
      if (error) {
        e.preventDefault();
        setHasSubmitted(true);
        setValidationError(error);
        return;
      }
    }
    handleKeyDown(e);
  };

  // Custom search handler with validation
  const handleCustomSearch = () => {
    if (inputValue.trim()) {
      setHasSubmitted(true);

      // Validate input
      const error = validateInput(inputValue, searchType);
      if (error) {
        setValidationError(error);
        return;
      }

      // Clear any previous errors and proceed with search
      setValidationError(null);
      performSearch({
        q: inputValue,
      });
    }
  };

  return {
    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    hasSubmitted,
    filtersVisible,

    loadMoreRef,

    data,
    error,
    validationError,
    inputValue,
    searchParams,
    searchType,
    selectedMeters,
    selectedThemes,
    selectedEras,
    selectedRhymes,

    handleMatchTypeChange,
    handleRhymesChange,
    handleErasChange,
    handleMetersChange,
    handleThemesChange,
    handleCustomInputChange,
    handleCustomKeyDown,
    handleCustomSearch,
    toggleFilters,
    handleCustomSearchTypeChange,
  };
}
