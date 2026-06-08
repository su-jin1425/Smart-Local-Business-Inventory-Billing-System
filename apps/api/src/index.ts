import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./lib/db.js";
import { redis } from "./lib/redis.js";

const bootstrap = async () => {
  await pool.query("SELECT 1");
  await redis.connect();

  app.listen(env.PORT, () => {
    console.log(`Inventory V2 API listening on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
