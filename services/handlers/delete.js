import { logger } from "../../logger.js";

export function handleDelete(ctx, op) {
  const file = ctx.normalize(op.file);
  const before = ctx.read(file);

  log(ctx, "delete:start", { file });

  const after = "";

  ctx.write(file, after);

  ctx.opLog.push({ type: "delete", file: op.file, before, after });

  return { type: "delete", file: op.file, status: "deleted" };
}
