import { SITE_URL } from '@/constants/GLOBALS';
import { seoKeywords } from '@/constants/SEO_KEYWORDS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import { SearchContainer } from '@/features/search/components/__search-container';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Loading from './loading';

const JsonLd = dynamic(() => import('@/components/json-ld'));

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
      {/* HIDDEN */}
      <section className="sr-only pointer-events-none text-opacity-0 opacity-0" aria-hidden="true">
        <h1>{htmlHeadMetadata.description}</h1>
      </section>

      {/* ACTUAL Content */}
      <JsonLd data={jsonLd} />
      <Suspense fallback={<Loading />}>
        <SearchContainer />
      </Suspense>

      {/* HIDDEN */}
      <section className="sr-only pointer-events-none text-opacity-0 opacity-0" aria-hidden="true">
        <h3 className="sr-only">{htmlHeadMetadata.title}</h3>
        <ul>
          {seoKeywords.map((item) => (
            <li key={item}>
              <a href={SITE_URL}>{item}</a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
