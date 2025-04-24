import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex justify-center p-6">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
    </div>
  );
}
