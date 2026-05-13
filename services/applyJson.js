import fs from "fs";
import path from "path";

const BASE = process.cwd();
const safe = (p) => path.join(BASE, p);

let currentDryRun = false;
const virtualFS = {};

// ======================
// read
// ======================
function readFile(file) {
  if (currentDryRun) {
    return virtualFS[file] ?? "";
  }
  return fs.readFileSync(file, "utf-8");
}

// ======================
// write
// ======================
function writeFile(file, content) {
  if (currentDryRun) {
    virtualFS[file] = content;
    return;
  }
  fs.writeFileSync(file, content, "utf-8");
}

// ======================
// utils
// ======================
function getLines(file) {
  return readFile(file).split("\n");
}

function saveLines(file, lines) {
  writeFile(file, lines.join("\n"));
}

// ======================
// main
// ======================
export function applyJson(json) {
  const ops = Array.isArray(json) ? json : json.ops;
  currentDryRun = json.dryRun === true;

  const results = [];

  // ======================
  // dryRun初期化
  // ======================
  if (currentDryRun) {
    for (const op of ops || []) {
      const file = safe(op.file);

      if (fs.existsSync(file)) {
        virtualFS[file] = fs.readFileSync(file, "utf-8");
      } else {
        virtualFS[file] = "";
      }
    }
  }

  // ======================
  // 実行
  // ======================
  for (const op of ops || []) {
    if (!op.file) {
      results.push({ status: "error", reason: "missing_file", op });
      continue;
    }

    const file = safe(op.file);
    const type = (op.type || "").trim();

    switch (type) {

      case "write": {
        writeFile(file, op.content ?? "");
        results.push({ file: op.file, status: "written" });
        break;
      }

      case "replace": {
        const content = readFile(file);
        writeFile(
          file,
          content.split(op.find ?? "").join(op.replace ?? "")
        );
        results.push({ file: op.file, status: "replaced" });
        break;
      }

      case "replace_line": {
        const lines = getLines(file);

        if (op.line < 1 || op.line > lines.length) {
          results.push({ file: op.file, status: "error", reason: "out_of_range" });
          break;
        }

        lines[op.line - 1] = op.replace;
        saveLines(file, lines);

        results.push({ file: op.file, status: "replaced_line" });
        break;
      }

      case "append": {
        const content = readFile(file);
        writeFile(file, content + "\n" + op.content);

        results.push({ file: op.file, status: "appended" });
        break;
      }

      case "insert": {
        const lines = getLines(file);
        const idx = Math.max(0, (op.line ?? 1) - 1);

        lines.splice(idx, 0, op.content);
        saveLines(file, lines);

        results.push({ file: op.file, status: "inserted" });
        break;
      }

      case "delete": {
        const lines = getLines(file);

        if (op.line != null) {
          lines.splice(op.line - 1, 1);
        } else {
          const t = (op.target ?? "").trim();
          const filtered = lines.filter(l => l.trim() !== t);

          lines.length = 0;
          lines.push(...filtered);
        }

        saveLines(file, lines);

        results.push({ file: op.file, status: "deleted" });
        break;
      }

      case "read": {
        results.push({
          file: op.file,
          content: readFile(file)
        });
        break;
      }

      case "undo": {
        results.push({ status: "undo_not_supported" });
        break;
      }

      default: {
        results.push({ status: "unknown_op", op });
      }
    }
  }

  // ======================
  // dryRun（ここが最重要修正）
  // ======================
  if (currentDryRun) {
    return {
      dryRun: true,
      files: virtualFS
    };
  }

  return { ok: true, result: results };
}