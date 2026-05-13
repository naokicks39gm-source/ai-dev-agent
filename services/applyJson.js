import fs from "fs";
import path from "path";

const BASE = process.cwd();
const safe = (p) => path.join(BASE, p);

let currentDryRun = false;
const virtualFS = {};
const snapshots = {};
const opLog = [];

const ctx = {
  readFile,
  writeFile,
  getLines,
  saveLines,
  safe,
  virtualFS,
  snapshots,
  opLog,
  dryRun: currentDryRun
};

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
    if (!(file in snapshots)) {
      snapshots[file] = virtualFS[file] ?? "";
    }
    virtualFS[file] = content;
    return;
  }

  fs.writeFileSync(file, content, "utf-8");
}

// ======================
// log
// ======================
function recordOp(op, file, before, after) {
  opLog.push({
    op: op.type,
    file: op.file,
    before,
    after
  });
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
  // dryRun初期化（修正版）
  // ======================
  if (currentDryRun) {
    for (const op of ops || []) {
      const file = safe(op.file);

      if (!(file in virtualFS)) {
        virtualFS[file] = fs.existsSync(file)
          ? fs.readFileSync(file, "utf-8")
          : "";
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
        const before = readFile(file);
        const after = op.content ?? "";

        writeFile(file, after);
        recordOp(op, op.file, before, after);

        results.push({ file: op.file, status: "written" });
        break;
      }

      case "replace": {
        const before = readFile(file);

        const after = before
          .split(op.find ?? "")
          .join(op.replace ?? "");

        writeFile(file, after);
        recordOp(op, op.file, before, after);

        results.push({ file: op.file, status: "replaced" });
        break;
      }

      case "replace_line": {
        const lines = getLines(file);

        if (op.line < 1 || op.line > lines.length) {
          results.push({ file: op.file, status: "error", reason: "out_of_range" });
          break;
        }

        const idx = op.line - 1;

        const before = lines[idx];
        lines[idx] = op.replace;
        const after = lines[idx];

        saveLines(file, lines);
        recordOp(op, op.file, before, after);

        results.push({ file: op.file, status: "replaced_line" });
        break;
      }

      case "append": {
        const before = readFile(file);
        const after = before + "\n" + op.content;

        writeFile(file, after);
        recordOp(op, op.file, before, after);

        results.push({ file: op.file, status: "appended" });
        break;
      }

      case "insert": {
        const lines = getLines(file);

        const before = lines.join("\n");

        const idx = Math.max(0, (op.line ?? 1) - 1);
        lines.splice(idx, 0, op.content);

        const after = lines.join("\n");

        saveLines(file, lines);
        recordOp(op, op.file, before, after);

        results.push({ file: op.file, status: "inserted" });
        break;
      }

      case "delete": {
        const lines = getLines(file);

        const before = lines.join("\n");

        if (op.line != null) {
          lines.splice(op.line - 1, 1);
        } else {
          const t = (op.target ?? "").trim();
          const filtered = lines.filter(l => l.trim() !== t);

          lines.length = 0;
          lines.push(...filtered);
        }

        const after = lines.join("\n");

        saveLines(file, lines);
        recordOp(op, op.file, before, after);

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
  // dryRun出力（完成形）
  // ======================
  if (currentDryRun) {
    const diff = {};

    for (const file of Object.keys(virtualFS)) {
      diff[file] = {
        before: snapshots[file] ?? "",
        after: virtualFS[file]
      };
    }

    return {
      dryRun: true,
      diff,
      ops: opLog
    };
  }

  return { ok: true, result: results };
}