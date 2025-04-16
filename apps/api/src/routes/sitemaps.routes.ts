import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  API_URL,
  FETCH_PER_PAGE,
  MAX_URLS_PER_SITEMAP,
  NAV_LINKS,
  SITE_URL,
} from "../constants";
import {
  eraStatsMaterialized,
  meterStatsMaterialized,
  poemsMaterialized,
  poetStatsMaterialized,
  rhymeStatsMaterialized,
  themeStatsMaterialized,
} from "../schemas/db";
import { paginationSchema } from "../schemas/zod";
import type { AppContext } from "../types";
import { sendErrorResponse } from "../utils/error";

const app = new Hono<AppContext>()
  // Main sitemap index
  .get("/", async (c) => {
    const db = c.get("db");

    const poemsCountResult = await db
      .select({ count: sql`count(*)` })
      .from(poemsMaterialized);

    if (!poemsCountResult[0]) {
      throw new Error();
    }

    const totalPoems = Number(poemsCountResult[0].count);
    const totalPoemSitemaps = Math.ceil(totalPoems / MAX_URLS_PER_SITEMAP);

    const sitemapEntries = [
      {
        url: `${API_URL}/sitemaps/nav`,
        lastmod: new Date().toISOString(),
      },
      {
        url: `${API_URL}/sitemaps/poets`,
        lastmod: new Date().toISOString(),
      },
      {
        url: `${API_URL}/sitemaps/eras`,
        lastmod: new Date().toISOString(),
      },
      {
        url: `${API_URL}/sitemaps/meters`,
        lastmod: new Date().toISOString(),
      },
      {
        url: `${API_URL}/sitemaps/rhymes`,
        lastmod: new Date().toISOString(),
      },
      {
        url: `${API_URL}/sitemaps/themes`,
        lastmod: new Date().toISOString(),
      },
    ];

    for (let i = 1; i <= totalPoemSitemaps; i++) {
      sitemapEntries.push({
        url: `${API_URL}/sitemaps/poems/${i}`,
        lastmod: new Date().toISOString(),
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries
          .map(
            (entry) => `
          <sitemap>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
          </sitemap>
        `
          )
          .join("")}
      </sitemapindex>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Nav sitemap
  .get("/nav", async (c) => {
    // Filter out external links
    const navEntries = NAV_LINKS.filter((link) => !link.external).map(
      (link) => ({
        url: `${SITE_URL}${link.href}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: link.href === "/" ? 1.0 : 0.8,
      })
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${navEntries
          .map(
            (entry) => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
            <changefreq>${entry.changefreq}</changefreq>
            <priority>${entry.priority}</priority>
          </url>
        `
          )
          .join("")}
      </urlset>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Eras sitemap
  .get("/eras", async (c) => {
    const db = c.get("db");
    const eras = await db.select().from(eraStatsMaterialized);

    const eraListEntries = [
      {
        url: `${SITE_URL}/eras`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      },
    ];

    const eraEntries = eras.flatMap((era) => {
      const totalPages = Math.ceil(era.poemsCount / FETCH_PER_PAGE);

      return Array.from({ length: Math.max(1, totalPages) }, (_, i) => ({
        // Updated URL format to match your app structure
        url: `${SITE_URL}/eras/${era.slug}/page/${i + 1}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.7,
      }));
    });

    const allEntries = [...eraListEntries, ...eraEntries];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allEntries
          .map(
            (entry) => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
            <changefreq>${entry.changefreq}</changefreq>
            <priority>${entry.priority}</priority>
          </url>
        `
          )
          .join("")}
      </urlset>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Meters sitemap
  .get("/meters", async (c) => {
    const db = c.get("db");
    const meters = await db.select().from(meterStatsMaterialized);

    const meterListEntries = [
      {
        url: `${SITE_URL}/meters`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      },
    ];

    const meterEntries = meters.flatMap((meter) => {
      const totalPages = Math.ceil(meter.poemsCount / FETCH_PER_PAGE);

      return Array.from({ length: Math.max(1, totalPages) }, (_, i) => ({
        // Updated URL format to match your app structure
        url: `${SITE_URL}/meters/${meter.slug}/page/${i + 1}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.7,
      }));
    });

    const allEntries = [...meterListEntries, ...meterEntries];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allEntries
          .map(
            (entry) => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
            <changefreq>${entry.changefreq}</changefreq>
            <priority>${entry.priority}</priority>
          </url>
        `
          )
          .join("")}
      </urlset>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Poets sitemap
  .get("/poets", async (c) => {
    const db = c.get("db");
    const totalPoetsResult = await db
      .select({ count: sql`count(*)` })
      .from(poetStatsMaterialized);
    const totalPoets = Number(totalPoetsResult[0]?.count) || 0;

    // Calculate total pages for poets based on actual FETCH_PER_PAGE
    const totalPoetPages = Math.ceil(totalPoets / FETCH_PER_PAGE);

    // Create entries for poet list pages
    const poetListEntries = Array.from({ length: totalPoetPages }, (_, i) => ({
      // Updated URL format to match your app structure
      url: `${SITE_URL}/poets/page/${i + 1}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.8,
    }));

    // Get all poets to generate individual poet page URLs
    const poets = await db.select().from(poetStatsMaterialized);

    // Create entries for individual poet pages
    const poetEntries = poets.flatMap((poet) => {
      // Calculate total pages for this poet's poems based on actual FETCH_PER_PAGE
      const totalPages = Math.ceil(poet.poemsCount / FETCH_PER_PAGE);

      // Create an array of entries for each page of this poet's poems
      return Array.from({ length: Math.max(1, totalPages) }, (_, i) => ({
        // Updated URL format to match your app structure
        url: `${SITE_URL}/poets/${poet.slug}/page/${i + 1}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.7,
      }));
    });

    // Combine all entries
    const allEntries = [...poetListEntries, ...poetEntries];

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allEntries
          .map(
            (entry) => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
            <changefreq>${entry.changefreq}</changefreq>
            <priority>${entry.priority}</priority>
          </url>
        `
          )
          .join("")}
      </urlset>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Rhymes sitemap
  .get("/rhymes", async (c) => {
    const db = c.get("db");
    const rhymes = await db.select().from(rhymeStatsMaterialized);

    // Create entries for rhyme list page
    const rhymeListEntries = [
      {
        url: `${SITE_URL}/rhymes`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      },
    ];

    // Create entries for individual rhyme pages
    const rhymeEntries = rhymes.flatMap((rhyme) => {
      // Calculate total pages for this rhyme's poems based on actual FETCH_PER_PAGE
      const totalPages = Math.ceil(rhyme.poemsCount / FETCH_PER_PAGE);

      // Create an array of entries for each page of this rhyme's poems
      return Array.from({ length: Math.max(1, totalPages) }, (_, i) => ({
        // Updated URL format to match your app structure
        url: `${SITE_URL}/rhymes/${rhyme.slug}/page/${i + 1}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.7,
      }));
    });

    // Combine all entries
    const allEntries = [...rhymeListEntries, ...rhymeEntries];

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allEntries
          .map(
            (entry) => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
            <changefreq>${entry.changefreq}</changefreq>
            <priority>${entry.priority}</priority>
          </url>
        `
          )
          .join("")}
      </urlset>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Themes sitemap
  .get("/themes", async (c) => {
    const db = c.get("db");
    const themes = await db.select().from(themeStatsMaterialized);

    // Create entries for theme list page
    const themeListEntries = [
      {
        url: `${SITE_URL}/themes`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      },
    ];

    // Create entries for individual theme pages
    const themeEntries = themes.flatMap((theme) => {
      // Calculate total pages for this theme's poems based on actual FETCH_PER_PAGE
      const totalPages = Math.ceil(theme.poemsCount / FETCH_PER_PAGE);

      // Create an array of entries for each page of this theme's poems
      return Array.from({ length: Math.max(1, totalPages) }, (_, i) => ({
        // Updated URL format to match your app structure
        url: `${SITE_URL}/themes/${theme.slug}/page/${i + 1}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.7,
      }));
    });

    // Combine all entries
    const allEntries = [...themeListEntries, ...themeEntries];

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allEntries
          .map(
            (entry) => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
            <changefreq>${entry.changefreq}</changefreq>
            <priority>${entry.priority}</priority>
          </url>
        `
          )
          .join("")}
      </urlset>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Poems sitemap index
  .get("/poems", async (c) => {
    const db = c.get("db");

    // Count total poems
    const poemsCountResult = await db
      .select({ count: sql`count(*)` })
      .from(poemsMaterialized);

    if (!poemsCountResult[0]) {
      throw new Error();
    }

    const totalPoems = Number(poemsCountResult[0].count);
    const totalSitemaps = Math.ceil(totalPoems / MAX_URLS_PER_SITEMAP);

    // Create sitemap index entries
    const sitemapEntries = Array.from({ length: totalSitemaps }, (_, i) => ({
      url: `${API_URL}/sitemaps/poems/${i + 1}`,
      lastmod: new Date().toISOString(),
    }));

    // Create XML sitemap index
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries
          .map(
            (entry) => `
          <sitemap>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastmod}</lastmod>
          </sitemap>
        `
          )
          .join("")}
      </sitemapindex>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  // Poems sitemap for a specific page
  .get("/poems/:page", zValidator("param", paginationSchema), async (c) => {
    const db = c.get("db");
    const { page } = c.req.valid("param");

    // Calculate offset
    const offset = (page - 1) * MAX_URLS_PER_SITEMAP;

    // Get poems for this page
    const poems = await db
      .select()
      .from(poemsMaterialized)
      .limit(MAX_URLS_PER_SITEMAP)
      .offset(offset);

    // Create entries for poems
    const poemEntries = poems.map((poem) => ({
      url: `${SITE_URL}/poems/${poem.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "yearly",
      priority: 0.6,
    }));

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${poemEntries
            .map(
              (entry) => `
            <url>
              <loc>${entry.url}</loc>
              <lastmod>${entry.lastmod}</lastmod>
              <changefreq>${entry.changefreq}</changefreq>
              <priority>${entry.priority}</priority>
            </url>
          `
            )
            .join("")}
        </urlset>`;

    c.header("Content-Type", "application/xml");
    return c.body(xml);
  })
  //! ERR HANDLING ------------------------------------------>
  .onError((error, c) => {
    console.error("Error SITEMAPS Route:", error);

    if (error instanceof HTTPException) {
      return sendErrorResponse(c, error.message, error.status);
    }

    return sendErrorResponse(c, "Internal Server Error. SITEMAPS Route", 500);
  });

export default app;
