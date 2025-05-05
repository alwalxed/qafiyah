import { zValidator } from "@hono/zod-validator";
import { getMetersPoemsRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { FETCH_PER_PAGE, FORMAL_METERS } from "../constants";
import { meterPoems, meterStats } from "../schemas/db";
import type { AppContext } from "../types";

const app = new Hono<AppContext>()
  .get("/", async (c) => {
    const db = c.get("db");
    const meterStatResults = await db
      .select()
      .from(meterStats)
      .where(inArray(meterStats.name, FORMAL_METERS));
    // ---------------------------------------------->
    const meterStatCleanResults = meterStatResults.sort((a, b) =>
      a.name.localeCompare(b.name, "ar")
    );

    return c.json(createValidatedResponse("metersList", meterStatCleanResults));
  })
  .get(
    "/:slug/page/:page",
    zValidator("param", getMetersPoemsRequestSchema),
    async (c) => {
      const { slug, page } = c.req.valid("param");
      const db = c.get("db");

      const limit = FETCH_PER_PAGE;
      const offset = (page - 1) * limit;

      const meterInfo = await db
        .select({
          meterId: meterPoems.meterId,
          meterName: meterPoems.meterName,
          totalPoems: meterPoems.totalPoemsInMeter,
        })
        .from(meterPoems)
        .where(eq(meterPoems.meterSlug, slug))
        .limit(1);

      if (!meterInfo.length || !meterInfo[0]) {
        throw new HTTPException(404, { message: "Meter not found" });
      }

      const poems = await db
        .select({
          title: meterPoems.poemTitle,
          slug: meterPoems.poemSlug,
          poetName: meterPoems.poetName,
        })
        .from(meterPoems)
        .where(eq(meterPoems.meterSlug, slug))
        .limit(limit)
        .offset(offset);

      // Calculate pagination metadata
      const totalPages = Math.ceil(meterInfo[0].totalPoems / limit);

      const responseData = {
        meterDetails: {
          id: meterInfo[0].meterId,
          name: meterInfo[0].meterName,
          poemsCount: meterInfo[0].totalPoems,
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
        createValidatedResponse("metersPoems", responseData, paginationMeta)
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
        error: "Internal Server Error. METERS Route",
        status: 500,
      },
      500
    );
  });

export default app;
