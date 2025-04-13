import type { NeonClient, NeonDatabase } from "drizzle-orm/neon-serverless";

export type Bindings = {
  DATABASE_URL: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: {
    db: NeonDatabase<Record<string, never>> & { $client: NeonClient };
  };
};

export type PoemData = {
  slug: string;
  title: string | null;
  content: string | null;
  poet_name: string | null;
  poet_slug: string | null;
  meter_name: string | null;
  theme_name: string | null;
  type_name: string | null;
  era_name: string | null;
  era_slug: string | null;
};

export type Poem = {
  poem_id: number;
  poet_name: string;
  content: string;
};

// Standardized API response types
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  message?: string;
  status: number;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalItems?: number;
};
