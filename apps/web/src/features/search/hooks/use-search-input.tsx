'use client';

import type React from 'react';

import { useEffect, useState } from 'react';

export function useSearchInput(initialQuery = '') {
  const [inputValue, setInputValue] = useState(initialQuery);

  // Initialize input value when initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setInputValue(initialQuery);
    }
  }, [initialQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const resetInput = () => {
    setInputValue('');
  };

  return {
    inputValue,
    setInputValue,
    handleInputChange,
    resetInput,
  };
}
