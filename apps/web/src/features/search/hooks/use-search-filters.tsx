'use client';

import { useCallback, useMemo, useState } from 'react';
import { joinCommaSeparated, splitCommaSeparated } from '../utils/helpers';

export function useSearchFilters(initialSearchParams: {
  era_ids: string;
  rhyme_ids: string;
  meter_ids: string;
  theme_ids: string;
  search_type: 'poems' | 'poets';
  match_type: 'all' | 'any' | 'exact';
}) {
  const [filtersVisible, setFiltersVisible] = useState(false);

  const toggleFilters = useCallback(() => setFiltersVisible(!filtersVisible), [filtersVisible]);

  const selectedEras = splitCommaSeparated(initialSearchParams.era_ids);
  const selectedRhymes = splitCommaSeparated(initialSearchParams.rhyme_ids);
  const selectedMeters = splitCommaSeparated(initialSearchParams.meter_ids);
  const selectedThemes = splitCommaSeparated(initialSearchParams.theme_ids);

  const handleErasChange = (value: string | string[]) => {
    return joinCommaSeparated(value);
  };

  const handleRhymesChange = (value: string | string[]) => {
    return joinCommaSeparated(value);
  };

  const handleMetersChange = (value: string | string[]) => {
    return joinCommaSeparated(value);
  };

  const handleThemesChange = (value: string | string[]) => {
    return joinCommaSeparated(value);
  };

  const handleMatchTypeChange = useCallback(
    (value: string) => {
      const validMatchTypes = ['all', 'any', 'exact'] as const;
      if (typeof value === 'string' && validMatchTypes.includes(value as never)) {
        return value as (typeof validMatchTypes)[number];
      }
      return initialSearchParams.match_type;
    },
    [initialSearchParams.match_type]
  );

  return useMemo(
    () => ({
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
      handleMatchTypeChange,
    }),
    [
      filtersVisible,
      handleMatchTypeChange,
      selectedEras,
      selectedMeters,
      selectedRhymes,
      selectedThemes,
      toggleFilters,
    ]
  );
}
