import { zValidator } from "@hono/zod-validator";
import { getErasPoemsRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ERAS_SORT_ORDER, FETCH_PER_PAGE } from "../constants";
import { eraPoems, eraStats } from "../schemas/db";
import type { AppContext } from "../types";

const app = new Hono<AppContext>()
  .get("/", async (c) => {
    const db = c.get("db");
    const eraStatResults = await db.select().from(eraStats);
    // ---------------------------------------------------->
    const eraStatCleanResults = eraStatResults.sort(
      (a, b) =>
        ERAS_SORT_ORDER.indexOf(a.name) - ERAS_SORT_ORDER.indexOf(b.name)
    );

    return c.json(createValidatedResponse("erasList", eraStatCleanResults));
  })
  .get(
    "/:slug/page/:page",
    zValidator("param", getErasPoemsRequestSchema),
    async (c) => {
      const { slug, page } = c.req.valid("param");
      const db = c.get("db");

      const limit = FETCH_PER_PAGE;
      const offset = (page - 1) * limit;

      const eraInfoResults = await db
        .select({
          eraId: eraPoems.eraId,
          eraName: eraPoems.eraName,
          totalPoems: eraPoems.totalPoemsInEra,
        })
        .from(eraPoems)
        .where(eq(eraPoems.eraSlug, slug))
        .limit(1);

      if (!eraInfoResults.length || !eraInfoResults[0]) {
        throw new HTTPException(404, { message: "Era not found" });
      }

      const poemResults = await db
        .select({
          title: eraPoems.poemTitle,
          slug: eraPoems.poemSlug,
          poetName: eraPoems.poetName,
          meter: eraPoems.meterName,
        })
        .from(eraPoems)
        .where(eq(eraPoems.eraSlug, slug))
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(eraInfoResults[0].totalPoems / limit);

      const responseData = {
        eraDetails: {
          id: eraInfoResults[0].eraId,
          name: eraInfoResults[0].eraName,
          poemsCount: eraInfoResults[0].totalPoems,
        },
        poems: poemResults,
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
    console.error(error);

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
