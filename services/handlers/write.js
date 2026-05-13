import fs from "fs";
import path from "path";

export function handleWrite(op, safe) {
  const file = safe(op.file);

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, op.content ?? "", "utf-8");

  return { file: op.file, status: "written" };
}