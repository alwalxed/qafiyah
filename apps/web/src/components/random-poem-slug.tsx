'use client';

import { useRandomPoem } from '@/hooks/use-random-slug';
import { Loader2 } from 'lucide-react';

export function RandomPoemSlug() {
  const { handleClick, isLoading, isError } = useRandomPoem();

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label="قصيدة عشوائية"
    >
      {isError && <p className="text-red-400">حدث خطأ أثناء تحميل القصيدة</p>}
      {!isError && isLoading && (
        <p>
          <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
        </p>
      )}
      {!isError && !isLoading && <p>قصيدة عشوائية</p>}
    </button>
  );
}
