export function handleReplaceSafe(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);

  if (!before.includes(op.find)) {
    ctx.opLog.push({ type: "replace_safe", file: op.file, before, after: before });
    return { type: "replace_safe", file: op.file, status: "skipped" };
  }

  const after = before.replace(op.find, op.replace ?? "");

  ctx.write(file, after);

  ctx.opLog.push({ type: "replace_safe", file: op.file, before, after });

  return { type: "replace_safe", file: op.file, status: "ok" };
}
