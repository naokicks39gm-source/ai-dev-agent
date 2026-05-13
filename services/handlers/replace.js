import fs from "fs";

export function handleReplace(op, safe) {
  const file = safe(op.file);

  if (!fs.existsSync(file)) {
    return { file: op.file, status: "missing" };
  }

  let content = fs.readFileSync(file, "utf-8");
  content = content.split(op.find ?? "").join(op.replace ?? "");

  fs.writeFileSync(file, content, "utf-8");

  return { file: op.file, status: "replaced" };
}