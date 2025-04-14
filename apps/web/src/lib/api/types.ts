// Import types from our zod-schemas package
import type {
  eraDetailsSchema,
  eraPoemSchema,
  eraPoemsResponseSchema,
  eraSchema,
  errorResponseSchema,
  meterDetailsSchema,
  meterPoemSchema,
  meterPoemsResponseSchema,
  meterSchema,
  paginationMetaSchema,
  poemMetadataSchema,
  poetDetailsSchema,
  poetPoemSchema,
  poetPoemsResponseSchema,
  poetSchema,
  poetsListResponseSchema,
  processedPoemContentSchema,
  rhymeDetailsSchema,
  rhymePoemSchema,
  rhymePoemsResponseSchema,
  rhymeSchema,
  themeDetailsSchema,
  themePoemSchema,
  themePoemsResponseSchema,
  themeSchema,
  z,
} from '@qaf/zod-schemas';

// Common types used across the application

// API response wrapper - use a generic type for flexibility
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
  error?: string;
  message?: string;
  status?: number;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type PaginationMeta = z.infer<typeof paginationMetaSchema>['pagination'];

// Base types
export type Era = z.infer<typeof eraSchema>;
export type Meter = z.infer<typeof meterSchema>;
export type Poet = z.infer<typeof poetSchema>;
export type Rhyme = z.infer<typeof rhymeSchema>;
export type Theme = z.infer<typeof themeSchema>;

// Poem types
export type EraPoem = z.infer<typeof eraPoemSchema>;
export type MeterPoem = z.infer<typeof meterPoemSchema>;
export type PoetPoem = z.infer<typeof poetPoemSchema>;
export type RhymePoem = z.infer<typeof rhymePoemSchema>;
export type ThemePoem = z.infer<typeof themePoemSchema>;

// Use a generic Poem type that covers all poem types
export type Poem = {
  slug: string;
  title: string;
  poetName?: string;
  meter?: string;
};

// API response types
export type EraDetails = z.infer<typeof eraDetailsSchema>;
export type MeterDetails = z.infer<typeof meterDetailsSchema>;
export type PoetDetails = z.infer<typeof poetDetailsSchema>;
export type RhymeDetails = z.infer<typeof rhymeDetailsSchema>;
export type ThemeDetails = z.infer<typeof themeDetailsSchema>;

export type PoemData = z.infer<typeof poemMetadataSchema>;
export type ProcessedPoemContent = z.infer<typeof processedPoemContentSchema>;

type PoemDetailData = {
  data: z.infer<typeof poemMetadataSchema>;
  clearTitle: string;
  processedContent: z.infer<typeof processedPoemContentSchema>;
};

export type ProcessedPoem = PoemDetailData;

// Response data types
export type EraResponseData = z.infer<typeof eraPoemsResponseSchema>['data'];
export type MeterResponseData = z.infer<typeof meterPoemsResponseSchema>['data'];
export type PoetResponseData = z.infer<typeof poetPoemsResponseSchema>['data'];
export type RhymeResponseData = z.infer<typeof rhymePoemsResponseSchema>['data'];
export type ThemeResponseData = z.infer<typeof themePoemsResponseSchema>['data'];
export type PoetsData = z.infer<typeof poetsListResponseSchema>['data'];

// Paginated response types
export type EraPoems = EraResponseData;
export type MeterPoems = MeterResponseData;
export type PoetPoems = PoetResponseData;
export type RhymePoems = RhymeResponseData;
export type ThemePoems = ThemeResponseData;

// Navigation
export type NavLink = {
  name: string;
  href: string;
  external: boolean;
};

export type Poets = Poet[];

export type SearchResult = {
  id: number;
  title: string;
  slug: string;
  content_snippet: string;
  poet_name: string;
  poet_slug: string;
  meter_name: string | null;
  era_name: string | null;
};

// Search pagination type
export type SearchPagination = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// Search response data type
export type SearchResponseData = {
  results: SearchResult[];
  pagination: SearchPagination;
};

// Full search response type
export type SearchResponse = ApiResponse<SearchResponseData>;
