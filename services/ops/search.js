export function handleSearch(ctx, op) {
  const file = ctx.safe(op.file);
  const content = ctx.read(file);

  const lines = content.split("\n");
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(op.query ?? "")) {
      matches.push({ line: i + 1, content: lines[i] });
    }
  }

  return { type: "search", file: op.file, matches };
}
