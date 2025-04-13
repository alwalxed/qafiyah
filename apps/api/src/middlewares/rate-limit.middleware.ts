// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
// import { createMiddleware } from "hono/factory";
// import type { AppContext } from "../types";

// // Create a new ratelimiter that allows 10 requests per 10 seconds
// export const createRateLimiter = (
//   redis: Redis,
//   options: {
//     limit?: number;
//     window?: number; // in seconds
//     prefix?: string;
//   } = {}
// ) => {
//   const { limit = 10, window = 10, prefix = "api_ratelimit" } = options;

//   return new Ratelimit({
//     redis,
//     limiter: Ratelimit.slidingWindow(limit, `${window} s`),
//     analytics: true,
//     prefix,
//   });
// };

// export const rateLimitMiddleware = createMiddleware<AppContext>(
//   async (c, next) => {
//     // Skip rate limiting for sitemaps
//     if (c.req.path.startsWith("/sitemaps")) {
//       return next();
//     }

//     // Initialize Redis client
//     const redis = new Redis({
//       url: c.env.UPSTASH_REDIS_REST_URL,
//       token: c.env.UPSTASH_REDIS_REST_TOKEN,
//     });

//     const ratelimit = createRateLimiter(redis, {
//       prefix: "qafiyah_api",
//     });

//     // Use IP as identifier, with fallbacks
//     const identifier =
//       c.req.header("CF-Connecting-IP") ||
//       c.req.header("X-Forwarded-For") ||
//       c.req.header("X-Real-IP") ||
//       "anonymous";

//     // Check if rate limit is exceeded
//     const { success, limit, remaining, reset } = await ratelimit.limit(
//       identifier
//     );

//     // Set rate limit headers
//     c.header("X-RateLimit-Limit", limit.toString());
//     c.header("X-RateLimit-Remaining", remaining.toString());
//     c.header("X-RateLimit-Reset", reset.toString());

//     if (!success) {
//       return c.json(
//         {
//           error: "Too many requests",
//           message: "Rate limit exceeded. Please try again later.",
//         },
//         429
//       );
//     }

//     await next();
//   }
// );
