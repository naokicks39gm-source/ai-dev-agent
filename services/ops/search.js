export function search(ctx, op) {
  const result = {
    type: "search",
    query: op.query,
    status: "not_implemented"
  };

  ctx.log.push(result);
  return result;
}
