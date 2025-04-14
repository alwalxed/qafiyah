import { zValidator } from "@hono/zod-validator";
import {
  getPoetPoemsRequestSchema,
  getPoetRequestSchema,
  getPoetsRequestSchema,
} from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { FETCH_PER_PAGE } from "../constants";
import {
  poemsMaterialized,
  poetPoemsMaterialized,
  poetStatsMaterialized,
} from "../schemas/db";
import type { AppContext } from "../types";

const app = new Hono<AppContext>()
  .get("/page/:page", zValidator("param", getPoetsRequestSchema), async (c) => {
    const { page } = c.req.valid("param");
    const db = c.get("db");

    const limit = FETCH_PER_PAGE;
    const offset = (page - 1) * limit;

    const poets = await db
      .select()
      .from(poetStatsMaterialized)
      .limit(limit)
      .offset(offset);

    if (poets.length === 0 || !poets[0]) {
      throw new HTTPException(404, { message: "No poets found for this page" });
    }

    const totalPoets = await db.$count(poetStatsMaterialized);
    const totalPages = Math.ceil(totalPoets / limit);

    const responseData = {
      poets,
    };

    const paginationMeta = {
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalPoets,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    return c.json(
      createValidatedResponse("poetsList", responseData, paginationMeta)
    );
  })
  .get("/slug/:slug", zValidator("param", getPoetRequestSchema), async (c) => {
    const { slug } = c.req.valid("param");
    const db = c.get("db");

    const poetInfo = await db
      .select({
        poetId: poetPoemsMaterialized.poetId,
        poetName: poetPoemsMaterialized.poetName,
        totalPoems: poetPoemsMaterialized.totalPoemsByPoet,
      })
      .from(poetPoemsMaterialized)
      .where(eq(poetPoemsMaterialized.poetSlug, slug))
      .limit(1);

    if (!poetInfo.length || !poetInfo[0]) {
      throw new HTTPException(404, { message: "Poet not found" });
    }

    const eraInfo = await db
      .select({
        eraName: poemsMaterialized.era_name,
        eraSlug: poemsMaterialized.era_slug,
      })
      .from(poemsMaterialized)
      .where(eq(poemsMaterialized.poet_slug, slug))
      .limit(1);

    const responseData = {
      poet: {
        name: poetInfo[0].poetName,
        poemsCount: poetInfo[0].totalPoems,
        era:
          eraInfo.length && eraInfo[0]
            ? {
                name: eraInfo[0].eraName,
                slug: eraInfo[0].eraSlug,
              }
            : null,
      },
    };

    return c.json(createValidatedResponse("poetBasicInfo", responseData));
  })
  .get(
    "/:slug/page/:page",
    zValidator("param", getPoetPoemsRequestSchema),
    async (c) => {
      const { slug, page } = c.req.valid("param");
      const db = c.get("db");

      const limit = FETCH_PER_PAGE;
      const offset = (page - 1) * limit;

      const poetInfo = await db
        .select({
          poetId: poetPoemsMaterialized.poetId,
          poetName: poetPoemsMaterialized.poetName,
          totalPoems: poetPoemsMaterialized.totalPoemsByPoet,
        })
        .from(poetPoemsMaterialized)
        .where(eq(poetPoemsMaterialized.poetSlug, slug))
        .limit(1);

      if (!poetInfo.length || !poetInfo[0]) {
        throw new HTTPException(404, { message: "Poet not found" });
      }

      const poems = await db
        .select({
          title: poetPoemsMaterialized.poemTitle,
          slug: poetPoemsMaterialized.poemSlug,
          meter: poetPoemsMaterialized.meterName,
        })
        .from(poetPoemsMaterialized)
        .where(eq(poetPoemsMaterialized.poetSlug, slug))
        .limit(limit)
        .offset(offset);

      // Calculate pagination metadata
      const totalPages = Math.ceil(poetInfo[0].totalPoems / limit);

      const responseData = {
        poetDetails: {
          id: poetInfo[0].poetId,
          name: poetInfo[0].poetName,
          poemsCount: poetInfo[0].totalPoems,
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
        createValidatedResponse("poetPoems", responseData, paginationMeta)
      );
    }
  )
  //! ERR HANDLING ------------------------------------------>
  .onError((error, c) => {
    console.error("Error POETS Route:", error);

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
        error: "Internal Server Error. POETS Route",
        status: 500,
      },
      500
    );
  });

export default app;
