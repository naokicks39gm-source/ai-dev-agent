import fs from "fs";
import path from "path";

import { handleWrite } from "./handlers/write.js";
import { handleReplaceSafe } from "./handlers/replaceSafe.js";
import { handleReplaceLine } from "./handlers/replaceLine.js";
import { handleReplace } from "./handlers/replace.js";
import { handleSearch } from "./handlers/search.js";
import { handleDelete } from "./handlers/delete.js";
import { handleRead } from "./handlers/read.js";
import { handleAppend } from "./handlers/append.js";
import { handleInsert } from "./handlers/insert.js";

import { validate } from "./system/validate.js";
import { backup } from "./system/backup.js";
import { pushHistory } from "./system/history.js";
import { popHistory } from "./system/history.js";

const BASE = process.cwd();
const safe = (p) => path.join(BASE, p);

// ======================
// dryRun用仮FS
// ======================
let currentDryRun = false;
const virtualFS = {};

// ======================
// helper（dryRun対応）
// ======================
function readFile(file) {
  if (currentDryRun && virtualFS[file] !== undefined) {
    return virtualFS[file];
  }
  return fs.readFileSync(file, "utf-8");
}

function writeFile(file, content) {
  if (currentDryRun) {
    virtualFS[file] = content;
    return;
  }
  fs.writeFileSync(file, content, "utf-8");
}

// ======================
// main
// ======================
export function applyJson(json) {
  const results = [];

  const ops = Array.isArray(json) ? json : json.ops;
  currentDryRun = json.dryRun === true;

  console.log("OPS:", JSON.stringify(ops, null, 2));

  // ======================
  // dryRun 初期化（仮FS）
  // ======================
  if (currentDryRun) {
    for (const op of ops || []) {
      const file = safe(op.file);
      if (fs.existsSync(file)) {
        virtualFS[file] = fs.readFileSync(file, "utf-8");
      }
    }

    return {
      dryRun: true,
      ops
    };
  }

  // ======================
  // 実行ループ
  // ======================
  for (const op of ops || []) {

    const error = validate(op);
    if (error) {
      results.push({ op, status: "invalid", error });
      continue;
    }

    const type = (op.type || "").trim();
    const file = op.file ? safe(op.file) : null;

    console.log("OP:", type, op);

    if (file) {
      backup(file);
    }

    if (op.type !== "read" && file) {
      const before = fs.existsSync(file)
        ? readFile(file)
        : null;

      pushHistory(op, before);
    }

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
      results.push(handleReplace(op, safe));
      continue;
    }

    if (type === "search") {
      results.push(handleSearch(op, safe));
      continue;
    }

    if (type === "delete") {
      results.push(handleDelete(op, safe));
      continue;
    }

    if (type === "read") {
      results.push(handleRead(op, safe));
      continue;
    }

    if (type === "append") {
      results.push(handleAppend(op, safe));
      continue;
    }

    if (type === "insert") {
      results.push(handleInsert(op, safe));
      continue;
    }

    if (type === "undo") {
      const last = popHistory();
      if (!last) continue;

      writeFile(
        safe(last.op.file),
        last.before ?? ""
      );

      results.push({ status: "undone" });
      continue;
    }

    results.push({ status: "unknown_op", op });
  }

  return results;
}