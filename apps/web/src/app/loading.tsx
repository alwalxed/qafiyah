import { responsiveIconSize } from '@/constants/GLOBALS';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 h-full flex items-center justify-center">
      <Loader2 className={`${responsiveIconSize} text-zinc-600 animate-spin`} />
    </div>
  );
}
