'use client';

import { useEffect, useState } from 'react';

export function useTweetUrl() {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleTwitterShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
  };

  return {
    currentUrl,
    handleTwitterShare,
  };
}
