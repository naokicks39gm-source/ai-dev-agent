import fs from "fs";
import path from "path";

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
      const file = safe(op.path);

      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, op.content ?? "", "utf-8");

      results.push({ path: op.path, status: "written" });
      continue;
    }
    if (type === "replace_safe") {
      const file = safe(op.file);
      let content = fs.readFileSync(file, "utf-8");

      const count = content.split(op.find).length - 1;

      console.log("DEBUG count:", count);

      if (count !== op.expected) {
        console.log("SKIP:", { expected: op.expected, actual: count });

        results.push({
          file: op.file,
          status: "skipped",
          reason: `expected ${op.expected} but found ${count}`
        });
        continue;
      }

      console.log("REPLACE EXECUTED");

      content = content.split(op.find).join(op.replace);

      fs.writeFileSync(file, content, "utf-8");

      results.push({
        file: op.file,
        status: "replaced_safe",
        count
      });

      continue;
    }
    if (type === "replace_line") {
      const file = safe(op.file);
      let content = fs.readFileSync(file, "utf-8");

      const lines = content.split("\n");

      // 行番号チェック
      if (op.line < 1 || op.line > lines.length) {
        results.push({
          file: op.file,
          status: "error",
          reason: "line out of range"
        });
        continue;
      }

      const index = op.line - 1;

      // 安全チェック（任意だけど強く推奨）
      if (op.expected && lines[index] !== op.expected) {
        results.push({
          file: op.file,
          status: "skipped",
          reason: "line content mismatch",
          actual: lines[index]
        });
        continue;
      }

      // 置換
      lines[index] = op.replace;

      fs.writeFileSync(file, lines.join("\n"), "utf-8");

      results.push({
        file: op.file,
        status: "replaced_line",
        line: op.line
      });

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