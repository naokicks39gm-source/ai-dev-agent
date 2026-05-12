import { logger } from "../logger.js";

export function runTask(req, task) {
  logger.info("task received", {
    requestId: req.requestId,
    task
  });

  // 仮実行（ここがエージェント本体の入口）
  const result = {
    status: "done",
    input: task,
    output: `processed: ${task.type || "unknown"}`
  };

  logger.info("task completed", {
    requestId: req.requestId,
    result
  });

  return result;
}
