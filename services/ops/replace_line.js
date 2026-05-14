export function handleReplaceLine(ctx, op) {
  const file = ctx.safe(op.file);

  const lines = ctx.read(file).split("\n");
  const before = lines.join("\n");

  const idx = op.line - 1;
  if (idx < 0 || idx >= lines.length) {
    return { type: "replace_line", status: "out_of_range" };
  }

  lines[idx] = op.replace;

  const after = lines.join("\n");
  ctx.write(file, after);

  return { type: "replace_line", file: op.file, before, after };
}
