export function handleAppend(op, ctx) {
  const file = ctx.safe(op.file);

  const before = ctx.read(file);
  const after = before + "\n" + (op.content ?? "");

  ctx.write(file, after);

  return {
    type: "append",
    file: op.file,
    before,
    after
  };
}
