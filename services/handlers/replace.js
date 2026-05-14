export function handleReplace(op, ctx) {
  const file = ctx.safe(op.file);

  return {
    file: op.file,
    status: "ok",
    after: op.after
  };
}
