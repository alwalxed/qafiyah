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
      variant="default"
      onClick={toggleFilters}
      className={cn(
        'text-base font-normal flex items-center gap-4 px-2 py-1 transition-none duration-0 shadow-none ring-1 ring-zinc-300/40 border-0 outline-none',
        filtersVisible
          ? 'text-zinc-500/80 hover:text-zinc-500 duration-200 bg-white hover:bg-zinc-50/80 focus-visible:ring-zinc-300/40'
          : ' text-white hover:text-zinc-50 bg-zinc-900 hover:bg-zinc-800'
      )}
      aria-label={filtersVisible ? 'Collapse filters' : 'Expand filters'}
    >
      <Filter className="h-2 w-2" />
      {filtersVisible ? <ChevronUp className="h-2 w-2" /> : <ChevronDown className="h-2 w-2" />}
    </Button>
  );
}
