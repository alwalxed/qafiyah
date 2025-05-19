import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import type { MouseEventHandler } from 'react';

type Props = {
  toggleFilters: MouseEventHandler<HTMLButtonElement>;
  filtersVisible: boolean;
};

export function FiltersButton({ toggleFilters, filtersVisible }: Props) {
  return (
    <Button
      tabIndex={0}
      variant="default"
      onClick={toggleFilters}
      className={cn(
        'text-base font-normal h-12 rounded-xl flex justify-between gap-6 items-center px-4 transition-none duration-0 shadow-none ring-1 border-0 outline-none',
        filtersVisible
          ? 'text-zinc-600/80 hover:text-zinc-500 duration-200 bg-white hover:bg-white focus-visible:ring-zinc-800/40 ring-zinc-300/40'
          : 'text-zinc-50 hover:text-zinc-50 bg-zinc-800 hover:bg-zinc-800 ring-zinc-800'
      )}
      aria-label={filtersVisible ? 'Collapse filters' : 'Expand filters'}
    >
      <Filter tabIndex={-1} className="h-2 w-2" />
      {filtersVisible ? (
        <ChevronUp tabIndex={-1} className="h-2 w-2" />
      ) : (
        <ChevronDown tabIndex={-1} className="h-2 w-2" />
      )}
    </Button>
  );
}
