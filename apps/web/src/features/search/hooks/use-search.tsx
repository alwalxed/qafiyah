import { formatArabicCount } from 'arabic-count-format';
import { useInfiniteQuery } from './use-infinite-query';
import { useInfiniteScroll } from './use-infinite-scroll';
import { useInputValidation } from './use-input-validation';
import { usePlaceholderTypewriter } from './use-placeholder-typewriter';
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
    matchType,
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
    resetAllParamStates,
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

  const { effectText, handleTypingEffect } = usePlaceholderTypewriter();

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
        setSearchType(newSearchType);
        setQuery('');
        setMeterIds('');
        setThemeIds('');
        setRhymeIds('');
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
      const error = validateInput(inputValue);
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
      const error = validateInput(inputValue);
      if (error) {
        setValidationError(error);
        return;
      }

      // 1- Clear any previous errors
      setValidationError(null);
      // 1- Hide filters only if visible
      if (filtersVisible) {
        toggleFilters();
      }
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

  const resetAllStates = () => {
    resetAllParamStates();
    resetInput();
    resetValidation();
  };

  const searchTypeText = searchType === 'poems' ? 'بيت' : 'شاعر';
  const matchTypeText =
    matchType === 'any' ? 'أي كلمة' : matchType === 'all' ? 'جميع الكلمات' : 'مطابقة';
  //
  const normalizedCount = data?.[0]?.total_count ?? 0;

  const rawInput = searchParams.q || '';
  const cleanedInput = rawInput.replace(/[^\u0600-\u06FF\s]/g, '');
  const shortenedInputText =
    cleanedInput.length > 10 ? cleanedInput.slice(0, 10) + '...' : cleanedInput;

  const resultsText = formatArabicCount({
    count: normalizedCount,
    nounForms: {
      singular: 'نتيجة',
      dual: 'نتيجتان',
      plural: 'نتائج',
    },
  });
  const resultText = `عثر على ${resultsText} لـ "${shortenedInputText}" بحثًا عن «${searchTypeText}» بحثَ (${matchTypeText})`;

  const text = {
    refreshThePage: 'حدث الصفحة',

    currentHeaderTitle: searchType === 'poems' ? 'ابحث في مليون بيت' : 'ابحث عن ديوان شاعر',
    currentInputPlaceholder: searchType === 'poems' ? 'إن الذي سمك السماء بنى لنا' : 'المتنبي',
    currentFiltersButton: filtersVisible ? 'إخفاء الفلاتر' : 'عرض الفلاتر',

    search: 'ابحث',

    erasLabel: 'العصور',
    erasPlaceholder: 'عصر أو عدة عصور',
    erasPlaceholderNounForms: {
      singular: 'عصر',
      dual: 'عصران',
      plural: 'عصور',
    },
    metersLabel: 'البحور',
    metersPlaceholder: 'بحر أو عدة بحور',
    metersPlaceholderNounForms: {
      singular: 'بحر',
      dual: 'بحران',
      plural: 'بحور',
    },
    themesLabel: 'الأغراض',
    themesPlaceholder: 'غرض أو عدة أغراض',
    themesPlaceholderNounForms: {
      singular: 'غرض',
      dual: 'غرضان',
      plural: 'أغراض',
    },
    rhymesLabel: 'القوافي',
    rhymesPlaceholder: 'قافية أو عدة قوافي',
    rhymesPlaceholderNounForms: {
      singular: 'قافية',
      dual: 'قافيتان',
      plural: 'قوافي',
    },

    badgeErasCount: formatArabicCount({
      count: selectedEras.length || 0,
      nounForms: {
        singular: 'عصر',
        dual: 'عصران',
        plural: 'عصور',
      },
    }),
    badgeMetersCount: formatArabicCount({
      count: selectedMeters.length || 0,
      nounForms: {
        singular: 'بحر',
        dual: 'بحران',
        plural: 'بحور',
      },
    }),
    badgeThemesCount: formatArabicCount({
      count: selectedThemes.length || 0,
      nounForms: {
        singular: 'غرض',
        dual: 'غرضان',
        plural: 'أغراض',
      },
    }),
    badgeRhymesCount: formatArabicCount({
      count: selectedRhymes.length || 0,
      nounForms: {
        singular: 'قافية',
        dual: 'قافيتان',
        plural: 'قوافي',
      },
    }),

    searchTypeLabel: 'نوع البحث',
    searchTypePlaceholder: 'اختر نوع البحث',

    matchTypeLabel: 'طريقة البحث',
    matchTypePlaceholder: 'اختر طريقة البحث',

    errorMessage: 'عذرًا، وقع خلل غير متوقّع. إن استمر، فتواصل معنا تويتر',
    noResultsFound: `لم يُعثر على نتيجة لـ "${
      searchParams.q
        .replace(/[^\u0600-\u06FF\s]/g, '') // Keep only Arabic letters and spaces
        .slice(0, 20) + (searchParams.q.length > 20 ? '...' : '')
    }"`,

    resultText,
    searchTypeText,
    matchTypeText,
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

    toggleFilters,
    resetAllStates,

    handleMatchTypeChange,
    handleCustomInputChange,

    handleCustomKeyDown,
    handleCustomSearch,
    handleCustomSearchTypeChange,

    handleRhymesChange: handleRhymesChangeWithState,
    handleErasChange: handleErasChangeWithState,
    handleMetersChange: handleMetersChangeWithState,
    handleThemesChange: handleThemesChangeWithState,

    // type-effects
    effectText,
    handleTypingEffect,
  };
}
