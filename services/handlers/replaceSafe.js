import { logger } from "../../logger.js";

export function handleReplaceSafe(ctx, op) {
  const file = ctx.normalize(op.file);
  const before = ctx.read(file);

  log(ctx, "replaceSafe:start", { file });

  if (!before.includes(op.from)) {
    throw new Error("pattern not found");
  }

  const after = before.replace(op.from, op.to);

  ctx.write(file, after);

  ctx.opLog.push({ type: "replaceSafe", file: op.file, before, after });

  return { type: "replaceSafe", file: op.file, status: "replaced" };
}
