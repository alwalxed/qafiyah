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
import { poemsFullData, poetPoems, poetStats } from "../schemas/db";
import type { AppContext } from "../types";

const app = new Hono<AppContext>()
  .get("/page/:page", zValidator("param", getPoetsRequestSchema), async (c) => {
    const { page } = c.req.valid("param");
    const db = c.get("db");

    const limit = FETCH_PER_PAGE;
    const offset = (page - 1) * limit;

    const poets = await db.select().from(poetStats).limit(limit).offset(offset);

    if (poets.length === 0 || !poets[ 0 ]) {
      throw new HTTPException(404, { message: "No poets found for this page" });
    }

    const totalPoets = await db.$count(poetStats);
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
        poetId: poetPoems.poetId,
        poetName: poetPoems.poetName,
        totalPoems: poetPoems.totalPoemsByPoet,
      })
      .from(poetPoems)
      .where(eq(poetPoems.poetSlug, slug))
      .limit(1);

    if (!poetInfo.length || !poetInfo[ 0 ]) {
      throw new HTTPException(404, { message: "Poet not found" });
    }

    const eraInfo = await db
      .select({
        eraName: poemsFullData.era_name,
        eraSlug: poemsFullData.era_slug,
      })
      .from(poemsFullData)
      .where(eq(poemsFullData.poet_slug, slug))
      .limit(1);

    const responseData = {
      poet: {
        name: poetInfo[ 0 ].poetName,
        poemsCount: poetInfo[ 0 ].totalPoems,
        era:
          eraInfo.length && eraInfo[ 0 ]
            ? {
              name: eraInfo[ 0 ].eraName,
              slug: eraInfo[ 0 ].eraSlug,
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
          poetId: poetPoems.poetId,
          poetName: poetPoems.poetName,
          totalPoems: poetPoems.totalPoemsByPoet,
        })
        .from(poetPoems)
        .where(eq(poetPoems.poetSlug, slug))
        .limit(1);

      if (!poetInfo.length || !poetInfo[ 0 ]) {
        throw new HTTPException(404, { message: "Poet not found" });
      }

      const poems = await db
        .select({
          title: poetPoems.poemTitle,
          slug: poetPoems.poemSlug,
          meter: poetPoems.meterName,
        })
        .from(poetPoems)
        .where(eq(poetPoems.poetSlug, slug))
        .limit(limit)
        .offset(offset);

      // Calculate pagination metadata
      const totalPages = Math.ceil(poetInfo[ 0 ].totalPoems / limit);

      const responseData = {
        poetDetails: {
          id: poetInfo[ 0 ].poetId,
          name: poetInfo[ 0 ].poetName,
          poemsCount: poetInfo[ 0 ].totalPoems,
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
        error: "Internal Server Error. POETS Route",
        status: 500,
      },
      500
    );
  });

export default app;
