import { Button } from '@/components/shadcn/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import type { MouseEventHandler } from 'react';

type Props = {
  toggleFilters: MouseEventHandler<HTMLButtonElement>;
  currentFiltersButtonText: string;
  filtersVisible: boolean;
};

export function FiltersButton({ toggleFilters, currentFiltersButtonText, filtersVisible }: Props) {
  return (
    <Button
      variant="ghost"
      onClick={toggleFilters}
      className="text-xs flex items-center gap-1 px-2 py-1 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
    >
      <Filter className="h-3 w-3" />
      {currentFiltersButtonText}
      {filtersVisible ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
    </Button>
  );
}
