export function handleAppend(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);
  const after = before + (op.content ?? "");

  ctx.write(file, after);

  ctx.opLog.push({ type: "append", file: op.file, before, after });

  return { type: "append", file: op.file, status: "ok" };
}
