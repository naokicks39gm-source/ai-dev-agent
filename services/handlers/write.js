export function handleWrite(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);
  const after = op.content ?? "";

  ctx.write(file, after);

  ctx.opLog.push({
    type: "write",
    file: op.file,
    before,
    after
  });

  return {
    type: "write",
    file: op.file,
    status: "ok"
  };
}