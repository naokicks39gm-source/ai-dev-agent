export function handleRead(ctx, op) {
  const file = ctx.safe(op.file);
  const content = ctx.read(file);

  if (content == null) {
    return { type: "read", file: op.file, status: "missing" };
  }

  return { type: "read", file: op.file, content };
}
