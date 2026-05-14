export function handleReplace(ctx, op) {
  const file = ctx.safe(op.file);
  const before = ctx.read(file);

  const after = before.split(op.find ?? "").join(op.replace ?? "");

  ctx.write(file, after);

  return { type: "replace", file: op.file, before, after };
}
