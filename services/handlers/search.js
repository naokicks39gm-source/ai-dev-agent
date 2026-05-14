export function handleSearch(op, ctx) {
  const file = ctx.safe(op.file);

  return {
    file: op.file,
    matches: op.matches ?? []
  };
}
