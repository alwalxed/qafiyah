import Script from 'next/script';

// Base JSON-LD type with common properties
type JsonLdBase = {
  '@context': string;
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string;
  url?: string;
  image?:
    | string
    | {
        '@type': 'ImageObject';
        url: string;
        width?: number;
        height?: number;
      };
};

// Organization schema
type OrganizationJsonLd = JsonLdBase & {
  '@type': 'Organization';
  logo?: string;
  sameAs?: string[];
  contactPoint?: Array<{
    '@type': 'ContactPoint';
    telephone?: string;
    contactType?: string;
    email?: string;
    areaServed?: string | string[];
    availableLanguage?: string | string[];
  }>;
};

// Person schema
type PersonJsonLd = JsonLdBase & {
  '@type': 'Person';
  jobTitle?: string;
  telephone?: string;
  email?: string;
  sameAs?: string[];
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
};

// Product schema
type ProductJsonLd = JsonLdBase & {
  '@type': 'Product';
  brand?: {
    '@type': 'Brand' | 'Organization';
    name: string;
  };
  offers?: {
    '@type': 'Offer' | 'AggregateOffer';
    price?: number | string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
    validFrom?: string;
    priceValidUntil?: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number | string;
    reviewCount: number | string;
    bestRating?: number | string;
    worstRating?: number | string;
  };
  review?: Array<{
    '@type': 'Review';
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number | string;
    };
    reviewBody?: string;
  }>;
};

// Article schema
type ArticleJsonLd = JsonLdBase & {
  '@type': 'Article' | 'NewsArticle' | 'BlogPosting';
  headline: string;
  author:
    | {
        '@type': 'Person' | 'Organization';
        name: string;
      }
    | Array<{
        '@type': 'Person' | 'Organization';
        name: string;
      }>;
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
};

// BreadcrumbList schema
type BreadcrumbListJsonLd = JsonLdBase & {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
};

// FAQ schema
type FAQPageJsonLd = JsonLdBase & {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
};

// Event schema
type EventJsonLd = JsonLdBase & {
  '@type': 'Event';
  startDate: string;
  endDate?: string;
  location: {
    '@type': 'Place' | 'VirtualLocation';
    name: string;
    address?: {
      '@type': 'PostalAddress';
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    url?: string;
  };
  performer?:
    | {
        '@type': 'Person' | 'Organization';
        name: string;
      }
    | Array<{
        '@type': 'Person' | 'Organization';
        name: string;
      }>;
  offers?: {
    '@type': 'Offer';
    price?: number | string;
    priceCurrency?: string;
    availability?: string;
    validFrom?: string;
    url?: string;
  };
  organizer?: {
    '@type': 'Organization' | 'Person';
    name: string;
    url?: string;
  };
};

// LocalBusiness schema
type LocalBusinessJsonLd = OrganizationJsonLd & {
  '@type': 'LocalBusiness' | 'Restaurant' | 'Store' | 'Hotel';
  address: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number | string;
    longitude: number | string;
  };
  telephone?: string;
  priceRange?: string;
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
  }>;
};

// WebSite schema
type WebSiteJsonLd = JsonLdBase & {
  '@type': 'WebSite';
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
};

// Recipe schema
type RecipeJsonLd = JsonLdBase & {
  '@type': 'Recipe';
  recipeIngredient: string[];
  recipeInstructions:
    | string
    | Array<{
        '@type': 'HowToStep';
        text: string;
      }>;
  cookTime?: string;
  prepTime?: string;
  totalTime?: string;
  recipeYield?: string | number;
  recipeCategory?: string;
  recipeCuisine?: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  nutrition?: {
    '@type': 'NutritionInformation';
    calories?: string;
    fatContent?: string;
  };
};

// Union type for all JSON-LD schemas
type JsonLdData =
  | JsonLdBase
  | OrganizationJsonLd
  | PersonJsonLd
  | ProductJsonLd
  | ArticleJsonLd
  | BreadcrumbListJsonLd
  | FAQPageJsonLd
  | EventJsonLd
  | LocalBusinessJsonLd
  | WebSiteJsonLd
  | RecipeJsonLd
  // Allow for array of JSON-LD objects
  | JsonLdBase[]
  | OrganizationJsonLd[]
  | PersonJsonLd[]
  | ProductJsonLd[]
  | ArticleJsonLd[]
  | BreadcrumbListJsonLd[]
  | FAQPageJsonLd[]
  | EventJsonLd[]
  | LocalBusinessJsonLd[]
  | WebSiteJsonLd[]
  | RecipeJsonLd[];

export default function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
