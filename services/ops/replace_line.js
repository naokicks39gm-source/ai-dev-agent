export function replace_line(ctx, op) {
  const file = ctx.safe(op.file);
  const lines = ctx.getLines(file);

  const before = lines.join("\n");

  if (op.line < 1 || op.line > lines.length) {
    return {
      type: "replace_line",
      file: op.file,
      status: "out_of_range"
    };
  }

  lines[op.line - 1] = op.replace;

  const after = lines.join("\n");

  const result = {
    type: "replace_line",
    file: op.file,
    before,
    after
  };

  ctx.log.push(result);

  return result;
}
