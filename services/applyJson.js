import fs from "fs";
import path from "path";

export function applyJson(json) {
  const results = [];

  for (const op of json.ops || []) {
    if (op.type === "write") {
const exists = fs.existsSync(op.path);
if (exists && op.if_exists === "skip") {
  results.push({ path: op.path, status: "skipped" });
  continue;
}
      fs.mkdirSync(path.dirname(op.path), { recursive: true });
      fs.writeFileSync(op.path, op.content, "utf-8");

      results.push({
        path: op.path,
        status: "written"
      });
    }
  }

  return results;
}
