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
app.use((req, res, next) => {
  const original = res.end;

  res.end = function (...args) {
    if (req.requestId) {
      logger.info("request completed", {
        requestId: req.requestId,
        path: req.path,
        method: req.method
      });
    }
    original.apply(res, args);
  };

  next();
});

app.post("/log", (req, res) => {
  logger.info("client log", {
    requestId: req.requestId,
    body: req.body
  });

  res.json({ ok: true });
});

