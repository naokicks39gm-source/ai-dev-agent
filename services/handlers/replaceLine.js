import fs from "fs";

export function handleReplaceLine(op, safe) {
  const file = safe(op.file);
  let content = fs.readFileSync(file, "utf-8");

  const lines = content.split("\n");

  if (op.line < 1 || op.line > lines.length) {
    return {
      file: op.file,
      status: "error",
      reason: "line out of range"
    };
  }

  const index = op.line - 1;

  if (op.expected && lines[index] !== op.expected) {
    return {
      file: op.file,
      status: "skipped",
      reason: "line content mismatch",
      actual: lines[index]
    };
  }

  lines[index] = op.replace;

  fs.writeFileSync(file, lines.join("\n"), "utf-8");

  return {
    file: op.file,
    status: "replaced_line",
    line: op.line
  };
}