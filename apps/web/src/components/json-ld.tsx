'use client';

import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JsonLd({ data }: { data: any }) {
  useEffect(() => {
    const existingScript = document.getElementById('json-ld') as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.textContent = JSON.stringify(data);
    }
  }, [data]);

  return null;
}
