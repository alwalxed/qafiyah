import { zValidator } from "@hono/zod-validator";
import { getErasPoemsRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ERAS_SORT_ORDER, FETCH_PER_PAGE } from "../constants";
import { eraPoemsMaterialized, eraStatsMaterialized } from "../schemas/db";
import type { AppContext } from "../types";

const app = new Hono<AppContext>()
  .get("/", async (c) => {
    const db = c.get("db");
    const eraStats = await db.select().from(eraStatsMaterialized);
    const cleanup = eraStats.sort(
      (a, b) =>
        ERAS_SORT_ORDER.indexOf(a.name) - ERAS_SORT_ORDER.indexOf(b.name)
    );

    return c.json(createValidatedResponse("erasList", cleanup));
  })
  .get(
    "/:slug/page/:page",
    zValidator("param", getErasPoemsRequestSchema),
    async (c) => {
      const { slug, page } = c.req.valid("param");
      const db = c.get("db");

      const limit = FETCH_PER_PAGE;
      const offset = (page - 1) * limit;

      // Get era info and poems
      const eraInfo = await db
        .select({
          eraId: eraPoemsMaterialized.eraId,
          eraName: eraPoemsMaterialized.eraName,
          totalPoems: eraPoemsMaterialized.totalPoemsInEra,
        })
        .from(eraPoemsMaterialized)
        .where(eq(eraPoemsMaterialized.eraSlug, slug))
        .limit(1);

      if (!eraInfo.length || !eraInfo[0]) {
        throw new HTTPException(404, { message: "Era not found" });
      }

      const poems = await db
        .select({
          title: eraPoemsMaterialized.poemTitle,
          slug: eraPoemsMaterialized.poemSlug,
          poetName: eraPoemsMaterialized.poetName,
          meter: eraPoemsMaterialized.meterName,
        })
        .from(eraPoemsMaterialized)
        .where(eq(eraPoemsMaterialized.eraSlug, slug))
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(eraInfo[0].totalPoems / limit);

      const responseData = {
        eraDetails: {
          id: eraInfo[0].eraId,
          name: eraInfo[0].eraName,
          poemsCount: eraInfo[0].totalPoems,
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
        createValidatedResponse("erasPoems", responseData, paginationMeta)
      );
    }
  )
  //! ERR HANDLING ------------------------------------------>
  .onError((error, c) => {
    console.error("Error ERAS Route:", error);

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
        error: "Internal Server Error. ERAS Route",
        status: 500,
      },
      500
    );
  });

export default app;
