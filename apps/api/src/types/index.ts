import type { NeonClient, NeonDatabase } from "drizzle-orm/neon-serverless";

export type Bindings = {
  DATABASE_URL: string;
  SEARCH_DATABASE_URL: string;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: {
    db: NeonDatabase<Record<string, never>> & { $client: NeonClient };
  };
};

export type RandomPoemLines = {
  poem_id: number;
  poet_name: string;
  content: string;
};

export type PoemData = {
  slug: string;
  title: string;
  content: string;
  poet_name: string;
  poet_slug: string;
  meter_name: string;
  theme_name: string;
  era_name: string;
  era_slug: string;
};

type RelatedPoem = {
  poem_slug: string;
  poet_name: string;
  meter_name: string;
  poem_title: string;
};

type PoemWithRelatedSuccess = {
  poem: PoemData;
  related_poems: RelatedPoem[];
};

type PoemWithRelatedError = {
  error: string;
  message?: string;
};

export type PoemWithRelatedResponse =
  | PoemWithRelatedSuccess
  | PoemWithRelatedError;
