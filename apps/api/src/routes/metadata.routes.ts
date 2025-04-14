import { Hono } from "hono";
import type { AppContext } from "../types";

const app = new Hono<AppContext>().get("/poets", (c) => {
  return c.text("");
});

export default app;
