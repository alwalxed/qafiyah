'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SearchFormProps = {
  className?: string;
  isMobile?: boolean;
};

export function SearchForm({ className = '', isMobile = false }: SearchFormProps) {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <button
      onClick={handleSearchClick}
      className={`${className} flex items-center`}
      aria-label="فتح البحث"
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
          <Search className="size-4 xl:size-5" />
        </div>

        <div
          className={`w-full pr-10 pl-3 ${
            isMobile
              ? 'py-1 xxs:py-2 text-sm border border-zinc-300'
              : 'md:py-1 lg:py-2 text-sm bg-zinc-200/50 lg:text-lg md:text-base'
          } rounded-2xl text-zinc-500 ${isMobile ? 'text-zinc-400' : 'text-zinc-600'}`}
          dir="rtl"
        >
          ابحث
        </div>
      </div>
    </button>
  );
}
