export function handleReplaceSafe(ctx, op) {
  const file = ctx.safe(op.file);
  const before = ctx.read(file);

  const count = before.split(op.find).length - 1;
  if (count !== op.expected) {
    return { type: "replace_safe", status: "skipped" };
  }

  const after = before.split(op.find).join(op.replace);
  ctx.write(file, after);

  return { type: "replace_safe", file: op.file, before, after };
}
