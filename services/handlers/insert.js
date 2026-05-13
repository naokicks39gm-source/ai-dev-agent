import fs from "fs";

export function handleInsert(op, safe) {
  const file = safe(op.file);

  let lines = fs.readFileSync(file, "utf-8").split("\n");

  const index = Math.max(0, (op.line ?? 1) - 1);

  lines.splice(index, 0, op.content ?? "");

  fs.writeFileSync(file, lines.join("\n"), "utf-8");

  return {
    file: op.file,
    status: "inserted",
    line: op.line
  };
}