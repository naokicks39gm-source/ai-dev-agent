export function handleReplaceLine(op, ctx) {
  const file = ctx.safe(op.file);

  return {
    file: op.file,
    status: "ok",
    after: op.after
  };
}
