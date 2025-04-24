import { Button } from '@/components/shadcn/button';
import { Card } from '@/components/shadcn/card';
import { SITE_URL } from '@/constants/GLOBALS';
import { Frown } from 'lucide-react';

type Props = {
  errorMessageText: string;
  refreshThePageText: string;
};

export function ErrorState({ errorMessageText, refreshThePageText }: Props) {
  return (
    <Card className="border-red-100 bg-red-50/80 shadow-none flex justify-center items-center flex-col py-8 gap-4">
      <Frown className="w-16 h-16 text-red-600" />
      <p className="text-red-600 text-sm md:text-base font-bold text-center w-9/12">
        {errorMessageText}
      </p>
      <Button
        asChild
        variant="outline"
        className="border-red-200 mt-8 hover:bg-red-100 hover:text-red-700 text-red-600 text-xs md:text-sm"
        size="sm"
      >
        <a href={SITE_URL}>{refreshThePageText}</a>
      </Button>
    </Card>
  );
}
