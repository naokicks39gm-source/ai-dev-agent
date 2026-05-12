import { logger } from "../logger.js";

export function handleClientLog(req) {
  logger.info("client log", {
    requestId: req.requestId,
    body: req.body
  });

  return { ok: true };
}
