import express from "express";
import path from "path";
import { attachRequestId } from "./middleware/requestId.js";
import { logRoute } from "./routes/log.js";
import { logger } from "./logger.js";

const app = express();

app.use(attachRequestId);
app.use(express.json());
app.use(express.static(path.resolve(".")));

logRoute(app);

app.listen(3000, () => {
  logger.info("Server running");
});
