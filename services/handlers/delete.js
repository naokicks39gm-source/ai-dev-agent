import fs from "fs";
export function handleDelete(op, safe) {
  const file = safe(op.file);

  let lines = fs.readFileSync(file, "utf-8").split("\n");

  if (op.line < 1 || op.line > lines.length) {
    return { file: op.file, status: "error", reason: "line out of range" };
  }

  lines.splice(op.line - 1, 1);

  fs.writeFileSync(file, lines.join("\n"), "utf-8");

  return { file: op.file, status: "deleted", line: op.line };
}