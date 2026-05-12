import { logger } from "./logger.js";
import { attachRequestId } from "./requestId.js";
import express from "express";
import path from "path";

const app = express();
app.use(attachRequestId);
app.use(express.json());

app.use(express.static(path.resolve(".")));

app.post("/log", (req, res) => {
  logger.info("LOG", { body: req.body });

  res.sendStatus(200);
});

app.listen(3000, () => {
  logger.info("Server running");

});