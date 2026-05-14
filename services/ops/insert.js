export function insert(ctx, op) {
  const file = ctx.safe(op.file);
  const lines = ctx.getLines(file);

  const before = lines.join("\n");

  const idx = Math.max(0, (op.line ?? 1) - 1);
  lines.splice(idx, 0, op.content);

  const after = lines.join("\n");

  const result = {
    type: "insert",
    file: op.file,
    before,
    after
  };

  ctx.log.push(result);

  return result;
}
