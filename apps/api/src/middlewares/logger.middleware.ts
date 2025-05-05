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
      path,
      method,
      ip,
      userAgent,
      cf: {
        country: cfData?.country,
        city: cfData?.city,
        colo: cfData?.colo,
        asn: cfData?.asn,
      },
    });

    try {
      await next();
    } catch (error) {
      logger.error(error, {
        path,
        method,
        ip,
      });

      throw error;
    }
  }
);
