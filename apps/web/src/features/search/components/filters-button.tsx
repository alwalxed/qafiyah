import { Button } from '@/components/shadcn/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import type { MouseEventHandler } from 'react';

type Props = {
  toggleFilters: MouseEventHandler<HTMLButtonElement>;
  filtersVisible: boolean;
};

export function FiltersButton({ toggleFilters, filtersVisible }: Props) {
  return (
    <Button
      variant="ghost"
      onClick={toggleFilters}
      className="text-base font-normal flex items-center gap-4 px-2 py-1 text-white hover:bg-zinc-950 bg-zinc-900 hover:text-zinc-50"
      aria-label={filtersVisible ? 'Collapse filters' : 'Expand filters'}
    >
      <Filter className="h-2 w-2" />
      {filtersVisible ? <ChevronUp className="h-2 w-2" /> : <ChevronDown className="h-2 w-2" />}
    </Button>
  );
}
