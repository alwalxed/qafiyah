import { NAV_LINKS } from '@/constants/links';
import { sanitizeArabicText } from '@/utils/sanitize-arabic-text';
import { Loader2, X } from 'lucide-react';

export function EmptySearchState() {
  return (
    <div className="flex flex-col justify-center items-center h-[40svh]">
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        {NAV_LINKS.map(
          (link) =>
            link.external !== true && (
              <a
                key={link.href}
                href={link.href}
                className="bg-zinc-100/50 border border-zinc-300/40 rounded-md justify-center items-center flex"
              >
                {link.name}
              </a>
            )
        )}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center p-16 h-[30svh]">
      <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
      <p className="text-zinc-500">جار البحث...</p>
    </div>
  );
}

export function ErrorState() {
  return (
    <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-100 max-w-lg mx-auto">
      <p className="font-medium mb-1">حدث خطأ أثناء البحث</p>
      <p className="text-red-500 text-sm">يرجى المحاولة مرة أخرى لاحقاً</p>
    </div>
  );
}

type NoResultsProps = {
  query: string;
};

export function NoResults({ query }: NoResultsProps) {
  return (
    <div className="p-8 text-center max-w-lg mx-auto">
      <X className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
      <h3 className="text-xl font-medium text-zinc-500 mb-2">لم نجد قصيدة</h3>
      <p className="text-zinc-500">{`لم نتمكن من العثور على نتائج لـ "${sanitizeArabicText(query).slice(0, 10)}..."`}</p>
    </div>
  );
}
