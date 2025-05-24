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
        className={cn('size-10', 'md:size-12', 'xl:size-14', '2xl:size-16', '4xl:size-20')}
      />
    </a>
  );
}
