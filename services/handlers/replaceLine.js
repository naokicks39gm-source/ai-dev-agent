export function handleReplaceLine(ctx, op) {
  console.log("CTX_IN_HANDLER", ctx);
  console.log("SAFE_TYPE", typeof ctx.safe);
  const file = ctx.safe(op.file);

return {
  type: "replaceLine",
  file: op.file,
  status: "replaced"
};
}
