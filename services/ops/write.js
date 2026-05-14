export function handleWrite(ctx, op) {
  const file = ctx.safe(op.file);
  const before = ctx.read(file);

  const after = op.content ?? "";
  ctx.write(file, after);

  return { type: "write", file: op.file, before, after };
}
