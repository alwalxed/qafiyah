import { FETCH_PER_PAGE } from "../constants";

export type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type Priority = number & { __brand: "Priority" };

export type UrlEntry = {
  url: string;
  lastmod: string;
  changefreq?: ChangeFreq;
  priority?: Priority;
};

export const toPriority = (value: number): Priority => {
  const rounded = Math.round(value * 10) / 10;
  if (rounded < 0.0 || rounded > 1.0) {
    throw new Error(`Invalid priority: ${value}. Must be between 0.0 and 1.0`);
  }
  return rounded as Priority;
};

export const createPagedEntries = ({
  baseUrl,
  count,
  baseChangefreq,
  firstPageChangefreq,
  basePriority,
  firstPagePriority,
}: {
  baseUrl: string;
  count: number;
  baseChangefreq: ChangeFreq;
  firstPageChangefreq: ChangeFreq;
  basePriority: Priority;
  firstPagePriority: Priority;
}): UrlEntry[] => {
  const totalPages = Math.max(1, Math.ceil(count / FETCH_PER_PAGE));

  return Array.from({ length: totalPages }, (_, i): UrlEntry => {
    const page = i + 1;
    const priority = page === 1 ? firstPagePriority : basePriority;
    const changefreq = page === 1 ? firstPageChangefreq : baseChangefreq;

    return {
      url: `${baseUrl}/page/${page}`,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
    };
  });
};

export const generateUrlEntriesXml = (
  entries: UrlEntry[]
) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry?.priority?.toFixed(1)}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

interface SitemapEntry {
  url: string;
  lastmod: string;
}

export const generateSitemapIndexXml = (
  entries: SitemapEntry[]
) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `
  <sitemap>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </sitemap>`
  )
  .join("")}
</sitemapindex>`;
