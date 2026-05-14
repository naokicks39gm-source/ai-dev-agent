import fs from "fs";
import path from "path";

export function handleWrite(op, ctx) {
  const file = ctx.safe(op.file);

  const before = fs.existsSync(file)
    ? fs.readFileSync(file, "utf-8")
    : "";

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, op.content ?? "", "utf-8");

  const after = op.content ?? "";

  return {
    type: "write",
    file: op.file,
    before,
    after,
  };
}