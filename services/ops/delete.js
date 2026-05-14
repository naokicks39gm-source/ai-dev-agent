export function deleteOp(ctx, op) {
  const file = ctx.safe(op.file);
  const lines = ctx.getLines(file);

  const before = lines.join("\n");

  if (op.line != null) {
    lines.splice(op.line - 1, 1);
  }

  const after = lines.join("\n");

  const result = {
    type: "delete",
    file: op.file,
    before,
    after
  };

  ctx.log.push(result);

  return result;
}
