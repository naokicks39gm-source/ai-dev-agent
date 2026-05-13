import fs from "fs";
import path from "path";
import { handleWrite } from "./handlers/write.js";
import { handleReplaceSafe } from "./handlers/replaceSafe.js";
import { handleReplaceLine } from "./handlers/replaceLine.js";

const BASE = process.cwd();
const safe = (p) => path.join(BASE, p);

export function applyJson(json) {
  const results = [];

  const ops = Array.isArray(json) ? json : json.ops;

  console.log("OPS:", JSON.stringify(ops, null, 2));

  for (const op of ops || []) {
    const type = (op.type || "").trim();

    console.log("OP:", type, op);

   if (type === "write") {
  results.push(handleWrite(op, safe));
  continue;
}
   if (type === "replace_safe") {
  results.push(handleReplaceSafe(op, safe));
  continue;
}
  if (type === "replace_line") {
  results.push(handleReplaceLine(op, safe));
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

      if (type === "search") {
    const file = safe(op.file);
    const content = fs.readFileSync(file, "utf-8");

    const lines = content.split("\n");

    const matches = [];

    lines.forEach((line, i) => {
      if (line.includes(op.query)) {
        matches.push({
          line: i + 1,
          content: line
        });
      }
    });

    results.push({
      file: op.file,
      matches
    });

    continue;
  }

    if (type === "delete") {
      const file = safe(op.file);

      if (!fs.existsSync(file)) {
        results.push({ file: op.file, status: "missing" });
        continue;
      }

      let lines = fs.readFileSync(file, "utf-8").split("\n");
      lines = lines.filter(line => line.trim() !== (op.target ?? "").trim());

      fs.writeFileSync(file, lines.join("\n"), "utf-8");

      results.push({ file: op.file, status: "deleted" });
      continue;
    }

    results.push({ status: "unknown_op", op });
  }

  return results;
}