import fs from "fs";

export function handleReplaceSafe(op, safe) {
  const file = safe(op.file);
  let content = fs.readFileSync(file, "utf-8");

  const count = content.split(op.find).length - 1;

  if (count !== op.expected) {
    return {
      file: op.file,
      status: "skipped",
      reason: `expected ${op.expected} but found ${count}`
    };
  }

  content = content.split(op.find).join(op.replace);

  fs.writeFileSync(file, content, "utf-8");

  return {
    file: op.file,
    status: "replaced_safe",
    count
  };
}