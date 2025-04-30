'use client';

import { SITE_URL } from '@/constants/GLOBALS';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({
  message = 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
}: ErrorMessageProps) {
  const [isShaking, setIsShaking] = useState(false);

  // Add a subtle animation effect when the component mounts
  useEffect(() => {
    setIsShaking(true);
    const timer = setTimeout(() => setIsShaking(false), 650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-full w-full flex justify-center items-center flex-col gap-6 p-6 text-right"
      dir="rtl"
    >
      <div className={`flex items-center flex-col gap-3 ${isShaking ? 'animate-shake' : ''}`}>
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
        <p className="text-base md:text-lg font-medium text-red-500" role="alert">
          {message}
        </p>
      </div>

      <a
        href={SITE_URL}
        className="group flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-1.5 rounded-md text-zinc-50 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <span>الصفحة الرئيسة</span>
      </a>
    </div>
  );
}
