import JsonLd from '@/components/json-ld';
import { SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import { SearchContainer } from '@/features/search/components/__search-container';
import { Suspense } from 'react';
import Loading from './loading';

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: htmlHeadMetadata.title,
    url: SITE_URL,
    description: htmlHeadMetadata.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  } as const;

  return (
    <>
      {/* server rendered for SEO ----- */}
      <p className="sr-only">{htmlHeadMetadata.description}</p>
      {/* ----------------------------- */}

      <JsonLd data={jsonLd} />
      <Suspense fallback={<Loading />}>
        <SearchContainer />
      </Suspense>
    </>
  );
}
