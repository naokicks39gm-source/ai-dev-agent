export function replaceSafe(ctx, op) {
  const file = ctx.safe(op.file);
  const before = ctx.read(file);

  if (!before) {
    return {
      type: "replaceSafe",
      file: op.file,
      status: "missing"
    };
  }

  const after = before
    .split(op.find ?? "")
    .join(op.replace ?? "");

  const result = {
    type: "replaceSafe",
    file: op.file,
    before,
    after
  };

  ctx.log.push(result);
  return result;
}
