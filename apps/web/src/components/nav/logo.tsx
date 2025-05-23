import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo() {
  return (
    <a href="/" className="flex items-center">
      <Image
        src="/logo-48x48.svg"
        height="48"
        width="48"
        alt="Logo"
        className={cn('size-8', 'xxs:size-10', 'xs:size-12', 'lg:size-14')}
      />
    </a>
  );
}
