export function handleInsert(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);
  const lines = before.split("\n");

  const index = Math.max(0, op.line ?? 0);
  lines.splice(index, 0, op.content ?? "");

  const after = lines.join("\n");

  ctx.write(file, after);

  ctx.opLog.push({ type: "insert", file: op.file, before, after });

  return { type: "insert", file: op.file, status: "ok" };
}
