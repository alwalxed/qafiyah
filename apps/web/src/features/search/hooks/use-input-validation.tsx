'use client';

import { useState } from 'react';

export function useInputValidation() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validateInput = (input: string, type: 'poems' | 'poets'): string | null => {
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
