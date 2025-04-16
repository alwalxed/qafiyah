'use client';

import { useLayoutStore } from '@/store/layout-store';

export function LayoutDebug() {
  const { navHeight, footerHeight, remainingHeight } = useLayoutStore();

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs z-50 rounded-tr-md">
      <div>Nav: {navHeight.toFixed(0)}px</div>
      <div>Footer: {footerHeight.toFixed(0)}px</div>
      <div>Remaining: {remainingHeight.toFixed(0)}px</div>
    </div>
  );
}
