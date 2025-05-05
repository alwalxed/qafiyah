import { zValidator } from "@hono/zod-validator";
import { getRhymesPoemsRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ARABIC_LETTERS_MAP, FETCH_PER_PAGE } from "../constants";
import { rhymePoems, rhymeStats } from "../schemas/db";
import type { AppContext } from "../types";
import { logger } from "../utils/logger";
import { normalizeRhymePattern } from "../utils/rhyme";

const app = new Hono<AppContext>()
  .get("/", async (c) => {
    const db = c.get("db");
    const rhymeStatResults = await db.select().from(rhymeStats);

    const groupedRhymes = new Map<
      string,
      {
        rhymes: typeof rhymeStatResults;
        totalPoemsCount: number;
        totalPoetsCount: number;
      }
    >();

    for (const rhyme of rhymeStatResults) {
      const cleanPattern = normalizeRhymePattern(rhyme.pattern);

      for (const [letterName, variants] of ARABIC_LETTERS_MAP.entries()) {
        if (variants.includes(cleanPattern)) {
          if (!groupedRhymes.has(letterName)) {
            groupedRhymes.set(letterName, {
              rhymes: [],
              totalPoemsCount: 0,
              totalPoetsCount: 0,
            });
          }

          const group = groupedRhymes.get(letterName)!;
          group.rhymes.push(rhyme);
          group.totalPoemsCount += rhyme.poemsCount;
          group.totalPoetsCount += rhyme.poetsCount;
          break;
        }
      }
    }

    const enrichedGroups = Array.from(groupedRhymes.entries()).map(
      ([letter, { rhymes, totalPoemsCount, totalPoetsCount }]) => {
        const firstRhyme = rhymes[0];

        if (!firstRhyme) {
          throw new Error();
        }

        return {
          id: firstRhyme.id,
          name: letter,
          slug: firstRhyme.slug,
          poetsCount: totalPoetsCount,
          poemsCount: totalPoemsCount,
          totalUsage: totalPoetsCount + totalPoemsCount,
        };
      }
    );

    const cleanup = enrichedGroups.sort((a, b) =>
      a.name.localeCompare(b.name, "ar")
    );

    return c.json(createValidatedResponse("rhymesList", cleanup));
  })
  .get(
    "/:slug/page/:page",
    zValidator("param", getRhymesPoemsRequestSchema),
    async (c) => {
      const { slug, page } = c.req.valid("param");
      const db = c.get("db");

      const limit = FETCH_PER_PAGE;
      const offset = (page - 1) * limit;

      const rhymeInfo = await db
        .select({
          rhymeId: rhymePoems.rhymeId,
          rhymePattern: rhymePoems.rhymePattern,
          totalPoems: rhymePoems.totalPoemsByRhyme,
        })
        .from(rhymePoems)
        .where(eq(rhymePoems.rhymeSlug, slug))
        .limit(1);

      if (!rhymeInfo.length || !rhymeInfo[0]) {
        throw new HTTPException(404, { message: "Rhyme not found" });
      }

      const poems = await db
        .select({
          title: rhymePoems.poemTitle,
          slug: rhymePoems.poemSlug,
          meter: rhymePoems.meterName,
        })
        .from(rhymePoems)
        .where(eq(rhymePoems.rhymeSlug, slug))
        .limit(limit)
        .offset(offset);

      // Calculate pagination metadata
      const totalPages = Math.ceil(rhymeInfo[0].totalPoems / limit);

      const responseData = {
        rhymeDetails: {
          id: rhymeInfo[0].rhymeId,
          pattern: rhymeInfo[0].rhymePattern,
          poemsCount: rhymeInfo[0].totalPoems,
        },
        poems,
      };

      const paginationMeta = {
        pagination: {
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return c.json(
        createValidatedResponse("rhymesPoems", responseData, paginationMeta)
      );
    }
  )
  //! ERR HANDLING ------------------------------------------>
  .onError((error, c) => {
    logger.error({ error });

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
        error: "Internal Server Error. RHYMES Route",
        status: 500,
      },
      500
    );
  });

export default app;
