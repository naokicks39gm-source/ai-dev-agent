import { logger } from "../../logger.js";

export function handleInsert(ctx, op) {
  const file = ctx.normalize(op.file);
  const before = ctx.read(file);

  log(ctx, "insert:start", { file });

  const pos = op.position ?? before.length;
  const after =
    before.slice(0, pos) +
    (op.content ?? "") +
    before.slice(pos);

  ctx.write(file, after);

  ctx.opLog.push({ type: "insert", file: op.file, before, after });

  return { type: "insert", file: op.file, status: "inserted" };
}
