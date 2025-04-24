import { Card, CardContent } from '@/components/shadcn/card';
import { SearchIcon } from 'lucide-react';

type Props = {
  noResultsFoundText: string;
};

export function NoResultsState({ noResultsFoundText }: Props) {
  return (
    <Card className="border-zinc-300/50 bg-zinc-50 shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-8 text-zinc-500/90">
        <SearchIcon className="h-10 w-10 mb-3 text-zinc-500/90" />
        <p className="text-base text-center">{noResultsFoundText}</p>
      </CardContent>
    </Card>
  );
}
