import { createMiddleware } from "hono/factory";
import type { AppContext } from "../types";
import { logger } from "../utils/logger";

export const loggerMiddleware = createMiddleware<AppContext>(
  async (c, next) => {
    const path = c.req.path;
    const method = c.req.method;
    const ip = c.req.header("CF-Connecting-IP") || "unknown";
    const userAgent = c.req.header("User-Agent") || "unknown";
    const cfData = c.req.raw.cf;

    logger.info({
      type: "request",
      path,
      method,
      ip,
      userAgent,
      country: typeof cfData?.country === "string" ? cfData.country : "",
      city: typeof cfData?.city === "string" ? cfData.city : "",
      colo: typeof cfData?.colo === "string" ? cfData.colo : "",
      asn: typeof cfData?.asn === "string" ? cfData.asn : "",
    });

    try {
      await next();
    } catch (error) {
      logger.error({
        type: "error",
        path,
        method,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw error;
    }
  }
);
