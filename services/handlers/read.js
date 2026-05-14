export function handleRead(ctx, op) {
  console.log("CTX_IN_HANDLER", ctx);
  console.log("SAFE_TYPE", typeof ctx.safe);
  const file = ctx.safe(op.file);
  const content = ctx.read(file);

  return {
    file: op.file,
    content
  };
}
