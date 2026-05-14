export function handleReplaceLine(ctx, op) {
  console.log("🔥 REPLACE_LINE ENTER");

  const file = ctx.normalize(op.file);
  console.log("FILE", file);

  const before = ctx.read(file);
  console.log("BEFORE", before);

  const lines = before.split("\n");

  console.log("LINES", lines);

  const line = op.line ?? 0;

  if (line >= 0 && line < lines.length) {
    lines[line] = op.replace;
  }

  const after = lines.join("\n");

  ctx.write(file, after);

  ctx.opLog.push({
    type: "replace_line",
    file: op.file,
    before,
    after
  });

  return {
    type: "replace_line",
    file: op.file,
    status: "ok"
  };
}