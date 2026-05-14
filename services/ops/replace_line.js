export function handleReplaceLine(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);
  const lines = before.split("\n");

  const index = op.line ?? -1;

  if (index < 0 || index >= lines.length) {
    ctx.opLog.push({ type: "replace_line", file: op.file, before, after: before });
    return { type: "replace_line", file: op.file, status: "out_of_range" };
  }

  lines[index] = op.replace ?? "";

  const after = lines.join("\n");

  ctx.write(file, after);

  ctx.opLog.push({ type: "replace_line", file: op.file, before, after });

  return { type: "replace_line", file: op.file, status: "ok" };
}
