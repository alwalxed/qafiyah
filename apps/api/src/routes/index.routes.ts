import { Hono } from "hono";
import type { AppContext } from "../types";

const app = new Hono<AppContext>().get("/", (c) => {
  return c.text(
    `Qafiyah API Reference

- /                        - API health check
- /eras                    - Get all literary eras
- /eras/:slug/page/:page   - Get poems from a specific era
- /meters                  - Get all poetic meters
- /meters/:slug/page/:page - Get poems in a specific meter
- /poems/random            - Get a random poem excerpt
- /poems/slug/:slug        - Get poem details by slug
- /poets/page/:page        - Get paginated list of poets
- /poets/slug/:slug        - Get poet basic info
- /poets/:slug/page/:page  - Get poems by a specific poet
- /rhymes                  - Get all rhyme patterns
- /rhymes/:slug/page/:page - Get poems with a specific rhyme
- /search                  - Search poems or poets (params: q, search_type, page, match_type)
- /sitemaps                - Get sitemap index
- /themes                  - Get all themes
- /themes/:slug/page/:page - Get poems with a specific theme

For more details, visit our repository:
https://github.com/alwalxed/qafiyah`
  );
});

export default app;
