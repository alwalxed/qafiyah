import { responsiveIconSize } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <h1 className="text-2xl font-bold">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" height="32" width="32" alt="Logo" className={responsiveIconSize} />
      </Link>
    </h1>
  );
}
