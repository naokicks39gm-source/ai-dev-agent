import { logger } from "../../logger.js";

export function handleReplace(ctx, op) {
  const file = ctx.normalize(op.file);
  const before = ctx.read(file);

  log(ctx, "replace:start", { file });

  const after = before.replace(op.from, op.to);

  ctx.write(file, after);

  ctx.opLog.push({ type: "replace", file: op.file, before, after });

  return { type: "replace", file: op.file, status: "replaced" };
}
