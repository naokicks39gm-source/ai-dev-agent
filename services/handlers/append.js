import fs from "fs";

export function handleAppend(op, safe) {
  const file = safe(op.file);

  fs.appendFileSync(file, "\n" + (op.content ?? ""), "utf-8");

  return {
    file: op.file,
    status: "appended"
  };
}