import { zValidator } from "@hono/zod-validator";
import { getRhymesPoemsRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ARABIC_LETTERS_MAP, FETCH_PER_PAGE } from "../constants";
import { rhymePoemsMaterialized, rhymeStatsMaterialized } from "../schemas/db";
import type { AppContext } from "../types";
import { normalizeRhymePattern } from "../utils/rhyme";

const app = new Hono<AppContext>()
  .get("/", async (c) => {
    const db = c.get("db");
    const rhymeStats = await db.select().from(rhymeStatsMaterialized);

    const groupedRhymes = new Map<
      string,
      {
        rhymes: typeof rhymeStats;
        totalPoemsCount: number;
        totalPoetsCount: number;
      }
    >();

    for (const rhyme of rhymeStats) {
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
          rhymeId: rhymePoemsMaterialized.rhymeId,
          rhymePattern: rhymePoemsMaterialized.rhymePattern,
          totalPoems: rhymePoemsMaterialized.totalPoemsByRhyme,
        })
        .from(rhymePoemsMaterialized)
        .where(eq(rhymePoemsMaterialized.rhymeSlug, slug))
        .limit(1);

      if (!rhymeInfo.length || !rhymeInfo[0]) {
        throw new HTTPException(404, { message: "Rhyme not found" });
      }

      const poems = await db
        .select({
          title: rhymePoemsMaterialized.poemTitle,
          slug: rhymePoemsMaterialized.poemSlug,
          meter: rhymePoemsMaterialized.meterName,
        })
        .from(rhymePoemsMaterialized)
        .where(eq(rhymePoemsMaterialized.rhymeSlug, slug))
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
    console.error("Error RHYMES Route:", error);

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
