import { Router } from "express";
import { pool } from "../../lib/db.js";
import { redis } from "../../lib/redis.js";

export const healthRouter = Router();

healthRouter.get("/", async (_request, response) => {
  const [database, cache] = await Promise.allSettled([
    pool.query("SELECT 1"),
    redis.ping()
  ]);

  response.json({
    status:
      database.status === "fulfilled" && cache.status === "fulfilled"
        ? "ok"
        : "degraded",
    checks: {
      database: database.status === "fulfilled" ? "ok" : "error",
      redis: cache.status === "fulfilled" ? "ok" : "error"
    },
    version: "v2"
  });
});

