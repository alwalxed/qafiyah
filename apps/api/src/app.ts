import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { dbMiddleware } from "./middlewares/drizzle.middleware";
import eras from "./routes/eras.routes";
import metadata from "./routes/metadata.routes";
import meters from "./routes/meters.routes";
import poems from "./routes/poems.routes";
import poets from "./routes/poets.routes";
import rhymes from "./routes/rhymes.routes";
import sitemaps from "./routes/sitemaps.routes";
import themes from "./routes/themes.routes";
import type { AppContext } from "./types";

const app = new Hono<AppContext>();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://qafiyah.com",
      "https://react.qafiyah.com",
      "http://localhost:8787",
    ],
    allowMethods: ["GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", dbMiddleware);

const routes = app
  .route("/eras", eras)
  .route("/meters", meters)
  .route("/poems", poems)
  .route("/poets", poets)
  .route("/rhymes", rhymes)
  .route("/sitemaps", sitemaps)
  .route("/themes", themes)
  .route("/metadata", metadata)
  //* Global Error Handler
  .onError((error, c) => {
    console.error("Global Error Route:", error);
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
