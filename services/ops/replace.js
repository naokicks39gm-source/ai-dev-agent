export function handleReplace(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);
  const after = before.replace(op.find ?? "", op.replace ?? "");

  ctx.write(file, after);

  ctx.opLog.push({ type: "replace", file: op.file, before, after });

  return { type: "replace", file: op.file, status: "ok" };
}
