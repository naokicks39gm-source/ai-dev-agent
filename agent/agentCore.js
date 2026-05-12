import { runTask } from "../services/taskService.js";

export function handleAgent(req) {
  const task = req.body;

  if (!task) {
    return { error: "no task" };
  }

  return runTask(req, task);
}
