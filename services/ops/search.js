export function handleSearch(ctx, op) {
  const file = ctx.normalize(op.file);

  const before = ctx.read(file);

  const found = before.includes(op.query ?? "");

  ctx.opLog.push({ type: "search", file: op.file, before, after: before });

  return {
    type: "search",
    file: op.file,
    status: found ? "found" : "not_found"
  };
}
