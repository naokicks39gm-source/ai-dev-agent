export function read(ctx, op) {
  const file = ctx.safe(op.file);
  const content = ctx.read(file);

  const result = {
    type: "read",
    file: op.file,
    content
  };

  ctx.log.push(result);
  return result;
}
