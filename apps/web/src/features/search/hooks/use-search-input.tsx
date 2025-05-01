'use client';

import type React from 'react';

import { useCallback, useEffect, useMemo, useState } from 'react';

export function useSearchInput(initialQuery = '') {
  const [inputValue, setInputValue] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setInputValue(initialQuery);
    }
  }, [initialQuery]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const resetInput = useCallback(() => {
    setInputValue('');
  }, []);

  return useMemo(
    () => ({
      inputValue,
      setInputValue,
      handleInputChange,
      resetInput,
    }),
    [handleInputChange, inputValue, resetInput]
  );
}
