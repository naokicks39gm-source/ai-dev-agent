export function handleRead(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);

  ctx.opLog.push({ type: "read", file: op.file, before, after: before });

  return { type: "read", file: op.file, status: "ok", content: before };
}
