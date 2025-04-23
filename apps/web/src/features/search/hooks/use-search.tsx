import { toArabicDigits } from 'to-arabic-digits';
import { useInfiniteQuery } from './use-infinite-query';
import { useInfiniteScroll } from './use-infinite-scroll';
import { useInputValidation } from './use-input-validation';
import { useSearchFilters } from './use-search-filters';
import { useSearchInput } from './use-search-input';

export function useSearch() {
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
    setQuery,
    setSearchType,
    setMatchType,
    setEraIds,
    setRhymeIds,
    setMeterIds,
    setThemeIds,
  } = useInfiniteQuery({
    initialMatchType: 'all',
    initialSearchType: 'poems',
    queryKey: 'search',
  });

  // Use our extracted hooks
  const { loadMoreRef } = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const {
    inputValue,
    handleInputChange: baseHandleInputChange,
    resetInput,
  } = useSearchInput(searchParams.q);

  const {
    validationError,
    hasSubmitted,
    validateInput,
    setValidationError,
    setHasSubmitted,
    resetValidation,
  } = useInputValidation();

  const {
    filtersVisible,
    toggleFilters,
    selectedEras,
    selectedRhymes,
    selectedMeters,
    selectedThemes,
    handleErasChange,
    handleRhymesChange,
    handleMetersChange,
    handleThemesChange,
    handleMatchTypeChange: baseHandleMatchTypeChange,
  } = useSearchFilters({
    era_ids: searchParams.era_ids,
    rhyme_ids: searchParams.rhyme_ids,
    meter_ids: searchParams.meter_ids,
    theme_ids: searchParams.theme_ids,
    search_type: searchType,
    match_type: searchParams.match_type,
  });

  // Custom handlers that integrate the extracted hooks
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    baseHandleInputChange(e);
    // Clear validation error when input changes after submission
    if (hasSubmitted) {
      setValidationError(null);
    }
  };

  const handleCustomSearchTypeChange = (value: string) => {
    const newSearchType = value as 'poems' | 'poets';

    // If search type is changing, reset everything
    if (newSearchType !== searchParams.search_type) {
      // Clear input value
      resetInput();

      // Reset filters that don't apply to the new search type
      if (newSearchType === 'poets') {
        setQuery('');
        setSearchType(newSearchType);
        setMeterIds('');
        setThemeIds('');
      } else {
        setQuery('');
        setSearchType(newSearchType);
      }
    } else if (inputValue.trim()) {
      // Just update the search type if we have a query
      setSearchType(newSearchType);
    }

    // Clear validation errors when search type changes
    resetValidation();
  };

  const handleMatchTypeChange = (value: string) => {
    const newMatchType = baseHandleMatchTypeChange(value);
    setMatchType(newMatchType);
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
      handleCustomSearch();
    }
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
      setQuery(inputValue);
    }
  };

  // Handlers for filter changes that update the search state
  const handleErasChangeWithState = (value: string | string[]) => {
    const joinedEras = handleErasChange(value);
    setEraIds(joinedEras);
  };

  const handleRhymesChangeWithState = (value: string | string[]) => {
    const joinedRhymes = handleRhymesChange(value);
    setRhymeIds(joinedRhymes);
  };

  const handleMetersChangeWithState = (value: string | string[]) => {
    const joinedMeters = handleMetersChange(value);
    setMeterIds(joinedMeters);
  };

  const handleThemesChangeWithState = (value: string | string[]) => {
    const joinedThemes = handleThemesChange(value);
    setThemeIds(joinedThemes);
  };

  const text = {
    currentHeaderTitle: searchType === 'poems' ? 'ابحث في مليون بيت' : 'ابحث عن ديوان شاعر',
    currentInputPlaceholder: searchType === 'poems' ? 'إن الذي سمك السماء بنى لنا' : 'المتنبي',
    currentFilterButton: filtersVisible ? 'إخفاء الفلاتر' : 'عرض الفلاتر',

    search: 'ابحث',

    erasLabel: 'العصور',
    erasPlaceholder: 'اختر عصر أو عدة عصور',
    erasPlaceholderNounForms: {
      singular: 'عصر',
      dual: 'عصران',
      plural: 'عصور',
    },
    metersLabel: 'البحور',
    metersPlaceholder: 'اختر بحر أو عدة بحور',
    metersPlaceholderNounForms: {
      singular: 'بحر',
      dual: 'بحران',
      plural: 'بحور',
    },
    themesLabel: 'الموضوعات',
    themesPlaceholder: 'اختر موضوع أو عدة مواضيع',
    themesPlaceholderNounForms: {
      singular: 'موضوع',
      dual: 'موضوعان',
      plural: 'مواضيع',
    },
    rhymesLabel: 'القوافي',
    rhymesPlaceholder: 'اختر قافية أو عدة قوافي',
    rhymesPlaceholderNounForms: {
      singular: 'قافية',
      dual: 'قافيتان',
      plural: 'قوافي',
    },

    badgeErasCount: `العصور: ${toArabicDigits(selectedEras.length || 0)}`,
    badgeMetersCount: `البحور: ${toArabicDigits(selectedMeters.length || 0)}`,
    badgeThemesCount: `الموضوعات: ${toArabicDigits(selectedThemes.length || 0)}`,
    badgeRhymesCount: `القوافي: ${toArabicDigits(selectedRhymes.length || 0)}`,

    searchTypeLabel: 'نوع البحث',
    searchTypePlaceholder: 'اختر نوع البحث',

    matchTypeLabel: 'طريقة البحث',
    matchTypePlaceholder: 'اختر طريقة البحث',

    errorMessage: `خطأ: ${(error as Error)?.message || 'حدث خطأ ما'}`,
    noResultsFound: `${`لم يُعثر على نتيجة لـ "${searchParams.q.slice(0, 10)}..."`}`,

    resultsCount: `عثر على ${toArabicDigits(data?.[0]?.total_count ?? 0)} نتيجة لـ "${inputValue.length > 30 ? inputValue.slice(0, 30) + '...' : inputValue}"`,
  };

  return {
    text,

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
    handleRhymesChange: handleRhymesChangeWithState,
    handleErasChange: handleErasChangeWithState,
    handleMetersChange: handleMetersChangeWithState,
    handleThemesChange: handleThemesChangeWithState,
    handleCustomInputChange,
    handleCustomKeyDown,
    handleCustomSearch,
    toggleFilters,
    handleCustomSearchTypeChange,
  };
}
