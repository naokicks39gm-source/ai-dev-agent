import fs from "fs";

export function handleDelete(op, safe) {
  const file = safe(op.file);
  fs.writeFileSync(file, op.after ?? "", "utf-8");

  return {
    file: op.file,
    status: "deleted"
  };
}
