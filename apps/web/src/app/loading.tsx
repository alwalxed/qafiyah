import { responsiveIconSize } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full min-h-svh h-svh flex items-center justify-center">
      <Loader2 className={`${responsiveIconSize} text-zinc-800 animate-spin`} />
    </div>
  );
}
