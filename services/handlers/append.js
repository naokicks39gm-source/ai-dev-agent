import { logger } from "../../logger.js";

export function handleAppend(ctx, op) {
  // ① read
  const file = ctx.normalize(op.file);
  const before = ctx.read(file);

  log(ctx, "append:start", { file });

  // ② 加工
  const after = before + (op.content ?? "");

  // ③ write
  ctx.write(file, after);

  ctx.opLog.push({ type: "append", file: op.file, before, after });

  return { type: "append", file: op.file, status: "appended" };
}
