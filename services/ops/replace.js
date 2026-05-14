export function replace(ctx, op) {
  const file = ctx.safe(op.file);
  const before = ctx.read(file);

  const after = before.split(op.find ?? "").join(op.replace ?? "");

  const result = {
    type: "replace",
    file: op.file,
    before,
    after
  };

  ctx.log.push(result);

  return result;
}
