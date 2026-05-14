export function handleInsert(ctx, op) {
  const file = ctx.safe(op.file);

  const lines = ctx.read(file).split("\n");
  const before = lines.join("\n");

  const idx = Math.max(0, (op.line ?? 1) - 1);
  lines.splice(idx, 0, op.content ?? "");

  const after = lines.join("\n");
  ctx.write(file, after);

  return { type: "insert", file: op.file, before, after };
}
