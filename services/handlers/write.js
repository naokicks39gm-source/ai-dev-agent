export function handleWrite(ctx, op) {
  console.log("CTX_IN_HANDLER", ctx);

  const file = ctx.safe(op.file);

  const before = ctx.read(file);

  ctx.write(file, op.content ?? "");

  const after = op.content ?? "";

  ctx.opLog.push({
    type: "write",
    file: op.file,
    before,
    after,
  });

  return {
    type: "write",
    file: op.file,
    before,
    after,
  };
}