import { responsiveIconSize } from '@/constants/GLOBALS';
import Image from 'next/image';

export function Logo() {
  return (
    <h1 className="text-2xl font-bold">
      <a href="/" className="flex items-center">
        <Image
          src="/logo-32x32.svg"
          height="32"
          width="32"
          alt="Logo"
          className={responsiveIconSize}
        />
      </a>
    </h1>
  );
}
