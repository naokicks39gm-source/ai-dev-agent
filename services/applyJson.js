import fs from "fs";
import path from "path";
import { dispatch } from "./dispatch.js";

const BASE = process.cwd();

let currentDryRun = false;
const virtualFS = {};
const snapshots = {};
const opLog = [];

const safe = (p) => path.join(BASE, p);

function readFile(file) {
  if (currentDryRun) return virtualFS[file] ?? "";
  return fs.readFileSync(file, "utf-8");
}

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

const ctx = {
  safe: (p) => safe(p),   // ★ここ明示化（重要）
  read: readFile,
  write: writeFile,
  virtualFS,
  snapshots,
  opLog
};

export function applyJson(json) {
  const ops = Array.isArray(json) ? json : json.ops;
  currentDryRun = json.dryRun === true;

  const results = [];

  for (const op of ops || []) {
    const result = dispatch(op, ctx);
    results.push(result);
  }

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
