import fs from "fs";
import path from "path";

const BASE = process.cwd();
const safe = (p) => path.join(BASE, p);

export function applyJson(json) {
  const results = [];

  console.log("OPS:", JSON.stringify(json.ops, null, 2));

  for (const op of json.ops || []) {
    const type = (op.type || "").trim();

    console.log("OP:", type, op);

    if (type === "write") {
      const file = safe(op.path);

      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, op.content ?? "", "utf-8");

      results.push({ path: op.path, status: "written" });
      continue;
    }

    if (type === "replace") {
      const file = safe(op.file);

      if (!fs.existsSync(file)) {
        results.push({ file: op.file, status: "missing" });
        continue;
      }

      let content = fs.readFileSync(file, "utf-8");
      content = content.split(op.find ?? "").join(op.replace ?? "");

      fs.writeFileSync(file, content, "utf-8");

      results.push({ file: op.file, status: "replaced" });
      continue;
    }

    if (type === "delete") {
      const file = safe(op.file);

      if (!fs.existsSync(file)) {
        results.push({ file: op.file, status: "missing" });
        continue;
      }

      let lines = fs.readFileSync(file, "utf-8").split("\n");
      lines = lines.filter(line => line !== op.target);

      fs.writeFileSync(file, lines.join("\n"), "utf-8");

      results.push({ file: op.file, status: "deleted" });
      continue;
    }

    results.push({ status: "unknown_op", op });
  }

  return results;
}