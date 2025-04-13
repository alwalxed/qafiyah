import { drizzle } from "drizzle-orm/neon-serverless";
import { createMiddleware } from "hono/factory";
import type { AppContext } from "../types";

export const dbMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const db = drizzle(c.env.DATABASE_URL);
  c.set("db", db);
  await next();
});
