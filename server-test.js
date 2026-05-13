import express from "express";
import path from "path";
import { attachRequestId } from "./middleware/requestId.js";
import { logRoute } from "./routes/log.js";
import { agentRoute } from "./routes/agent.js";
import { applyRoute } from "./routes/apply.js";
import { logger } from "./logger.js";

const app = express();

app.use(attachRequestId);
app.use(express.json());
app.use(express.static(path.resolve(".")));

logRoute(app);
agentRoute(app);
applyRoute(app);

app.listen(3001, () => {
  logger.info("Server running on 3001");
});