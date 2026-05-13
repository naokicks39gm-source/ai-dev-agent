import fs from "fs";

export function handleDelete(op, safe) {
  const file = safe(op.file);

  if (!fs.existsSync(file)) {
    return { file: op.file, status: "missing" };
  }

  let lines = fs.readFileSync(file, "utf-8").split("\n");

  lines = lines.filter(
    (line) => line.trim() !== (op.target ?? "").trim()
  );

  fs.writeFileSync(file, lines.join("\n"), "utf-8");

  return { file: op.file, status: "deleted" };
}