'use client';

import { useState } from 'react';

export function useInputValidation() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validateInput = (input: string): string | null => {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;

    if (!arabicRegex.test(input)) {
      return 'يرجى إدخال كلمات باللغة العربية فقط';
    }

    if (input.length > 50) {
      return 'يجب ألا يتجاوز النص 50 حرفًا';
    }

    const words = input
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (words.length < 1) {
      return 'يرجى إدخال كلمة واحدة على الأقل';
    }

    if (words[0].length < 2) {
      return 'يجب أن تتكون الكلمة الأولى من حرفين على الأقل';
    }

    return null;
  };

  const resetValidation = () => {
    setValidationError(null);
    setHasSubmitted(false);
  };

  return {
    validationError,
    hasSubmitted,
    validateInput,
    setValidationError,
    setHasSubmitted,
    resetValidation,
  };
}
