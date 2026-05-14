export function handleRead(op, ctx) {
  const file = ctx.safe(op.file);
  const content = ctx.read(file);

  return {
    file: op.file,
    content
  };
}
