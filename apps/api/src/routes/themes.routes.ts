import { zValidator } from "@hono/zod-validator";
import { getThemesPoemsRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { FETCH_PER_PAGE } from "../constants";
import { themePoems, themeStats } from "../schemas/db";
import type { AppContext } from "../types";

const app = new Hono<AppContext>()
  .get("/", async (c) => {
    const db = c.get("db");
    const themeStatResults = await db.select().from(themeStats);
    // -------------------------------------------------------->
    const cleanup = themeStatResults.sort(
      (a, b) => b.poemsCount - a.poemsCount
    );

    return c.json(createValidatedResponse("themesList", cleanup));
  })
  .get(
    "/:slug/page/:page",
    zValidator("param", getThemesPoemsRequestSchema),
    async (c) => {
      const { slug, page } = c.req.valid("param");
      const db = c.get("db");

      const limit = FETCH_PER_PAGE;
      const offset = (page - 1) * limit;

      const themeInfo = await db
        .select({
          themeId: themePoems.themeId,
          themeName: themePoems.themeName,
          totalPoems: themePoems.totalPoemsByTheme,
        })
        .from(themePoems)
        .where(eq(themePoems.themeSlug, slug))
        .limit(1);

      if (!themeInfo.length || !themeInfo[0]) {
        throw new HTTPException(404, { message: "Theme not found" });
      }

      const poems = await db
        .select({
          title: themePoems.poemTitle,
          slug: themePoems.poemSlug,
          poetName: themePoems.poetName,
          meter: themePoems.meterName,
        })
        .from(themePoems)
        .where(eq(themePoems.themeSlug, slug))
        .limit(limit)
        .offset(offset);

      // Calculate pagination metadata
      const totalPages = Math.ceil(themeInfo[0].totalPoems / limit);

      const responseData = {
        themeDetails: {
          id: themeInfo[0].themeId,
          name: themeInfo[0].themeName,
          poemsCount: themeInfo[0].totalPoems,
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
        createValidatedResponse("themesPoems", responseData, paginationMeta)
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
        error: "Internal Server Error. THEMES Route",
        status: 500,
      },
      500
    );
  });

export default app;
