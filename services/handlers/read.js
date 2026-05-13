import fs from "fs";

export function handleRead(op, safe) {
  const file = safe(op.file);

  if (!fs.existsSync(file)) {
    return { file: op.file, status: "missing" };
  }

  const content = fs.readFileSync(file, "utf-8");

  return {
    file: op.file,
    content
  };
}