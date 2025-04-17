'use client';

import { isDev } from '@/constants/GLOBALS';
import { cn } from '@/utils/conversions/cn';
import { useEffect } from 'react';
import { ibmPlexSansArabic } from './font';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(
        'overflow-x-hidden bg-zinc-50 text-zinc-950 w-full',
        ibmPlexSansArabic.variable,
        {
          'debug-screens': isDev,
        }
      )}
    >
      <body className="bg-zinc-50 text-zinc-900 min-h-svh flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-zinc-200 rounded-md p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">حدث خطأ!</h2>
          <p className="text-zinc-600 mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={refreshPage}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors cursor-pointer"
            >
              تحديث الصفحة
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-zinc-500/20 hover:bg-zinc-700/20 text-zinc-700 rounded-md transition-colors cursor-pointer"
            >
              الصفحة الرئيسية
            </a>
          </div>
          {error.digest && (
            <p className="mt-4 text-xs text-zinc-500 font-mono">رمز الخطأ: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
