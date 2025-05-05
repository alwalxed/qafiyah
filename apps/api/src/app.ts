/**
 * Qafiyah API - Main Application Entry Point
 *
 * This file sets up the Hono application with all middleware, routes,
 * and error handling for the Qafiyah API.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { dbMiddleware } from "./middlewares/drizzle.middleware";
import eras from "./routes/eras.routes";
import index from "./routes/index.routes";
import meters from "./routes/meters.routes";
import poems from "./routes/poems.routes";
import poets from "./routes/poets.routes";
import rhymes from "./routes/rhymes.routes";
import search from "./routes/search.routes";
import sitemaps from "./routes/sitemaps.routes";
import themes from "./routes/themes.routes";
import type { AppContext } from "./types";

/**
 * Initialize the Hono application
 */
const app = new Hono<AppContext>();

/**
 * Register global middleware
 *
 * Order is important:
 * 1. CORS - Handle cross-origin requests
 * 2. Logger - Log all requests before processing
 * 3. Database - Connect to the database for data access
 */
app.use(
  cors({
    origin: ["http://localhost:3000", "https://qafiyah.com"],
    allowMethods: ["GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 600,
    credentials: true,
  })
);
app.use(logger());
app.use(dbMiddleware);

/**
 * Register API routes
 *
 * Each route module handles a specific domain of the API:
 * - index: Simple API documentation
 * - eras: Historical eras of Arabic poetry
 * - meters: Poetic meters (buhur)
 * - poems: Individual poems
 * - poets: Poet information
 * - rhymes: Rhyme patterns
 * - search: Search functionality
 * - sitemaps: SEO sitemaps
 * - themes: Poetic themes
 */
const routes = app
  .route("/", index)
  .route("/eras", eras)
  .route("/meters", meters)
  .route("/poems", poems)
  .route("/poets", poets)
  .route("/rhymes", rhymes)
  .route("/sitemaps", sitemaps)
  .route("/themes", themes)
  .route("/search", search)
  /**
   * Global error handler
   *
   * Catches all unhandled errors and provides a consistent error response format
   */
  .onError((error, c) => {
    console.error({
      message: "Global error handler caught an error",
      path: c.req.path,
      method: c.req.method,
      error: error instanceof Error ? error.message : String(error),
    });

    // Return appropriate error response
    if (error instanceof HTTPException) {
      return c.json(
        {
          success: false,
          error: error.message,
          status: error.status,
        },
        error.status
      );
    }

    // Default server error response
    return c.json(
      {
        success: false,
        error: "Internal Server Error. Global",
        status: 500,
      },
      500
    );
  });

export default app;
export type AppType = typeof routes;
