import { Hono } from "hono";
import type { AppContext } from "../types";

const app = new Hono<AppContext>().get("/", (c) => {
  return c.text(
    `Qafiyah API Reference

Health Check:
- GET /

Eras:
- GET /eras
- GET /eras/:slug/page/:page

Meters:
- GET /meters
- GET /meters/:slug/page/:page

Poems:
- GET /poems/random
- GET /poems/slug/:slug

Poets:
- GET /poets/page/:page
- GET /poets/slug/:slug
- GET /poets/:slug/page/:page

Rhymes:
- GET /rhymes
- GET /rhymes/:slug/page/:page

Search:
- GET /search
  (params: q, search_type, page, match_type)

Sitemaps:
- GET /sitemaps

Themes:
- GET /themes
- GET /themes/:slug/page/:page

Repository:
https://github.com/alwalxed/qafiyah`
  );
});

export default app;
