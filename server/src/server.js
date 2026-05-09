import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";
import { ensureAdminSeedUser } from "./services/auth.service.js";

export async function startServer() {
  try {
    await connectDatabase();
    await ensureAdminSeedUser();
    const app = createApp();
    app.listen(env.PORT, () => {
      logger.info(`Server listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
}
