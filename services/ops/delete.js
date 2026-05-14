export function handleDelete(op, ctx) {
  const file = ctx.safe(op.file);

  const lines = ctx.read(file).split("\n");
  const before = lines.join("\n");

  if (op.line != null) {
    lines.splice(op.line - 1, 1);
  } else {
    const t = (op.target ?? "").trim();
    const filtered = lines.filter(l => l.trim() !== t);
    lines.length = 0;
    lines.push(...filtered);
  }

  const after = lines.join("\n");

  ctx.write(file, after);

  return {
    type: "delete",
    file: op.file,
    before,
    after
  };
}
