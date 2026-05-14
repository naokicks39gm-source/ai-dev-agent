export function append(ctx, op) {
  const file = ctx.safe(op.file);

  const before = ctx.read(file);
  const after = before + "\n" + (op.content ?? "");

  const result = {
    type: "append",
    file: op.file,
    before,
    after
  };

  ctx.log.push(result);

  return result;
}
