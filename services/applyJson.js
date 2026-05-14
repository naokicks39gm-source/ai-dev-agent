import fs from "fs";
import path from "path";
import { dispatch } from "./dispatch.js";

const BASE = process.cwd();

const safe = (p) => path.join(BASE, p);

function readFile(file, virtualFS, currentDryRun) {
  if (currentDryRun) return virtualFS[file] ?? "";
  return fs.readFileSync(file, "utf-8");
}

function writeFile(file, content, ctx) {
  const { virtualFS, snapshots, currentDryRun } = ctx;

  if (currentDryRun) {
    if (!(file in snapshots)) {
      snapshots[file] = virtualFS[file] ?? "";
    }
    virtualFS[file] = content;
    return;
  }

  fs.writeFileSync(file, content, "utf-8");
}

export function applyJson(json) {
  const ops = Array.isArray(json) ? json : json.ops;

  const currentDryRun = json.dryRun === true;

  const virtualFS = {};
  const snapshots = {};
  const opLog = [];

  const ctx = {
    safe: (p) => safe(p),
    read: (f) => readFile(f, virtualFS, currentDryRun),
    write: (f, c) => writeFile(f, c, { virtualFS, snapshots, currentDryRun }),
    virtualFS,
    snapshots,
    opLog
  };

  const results = [];

  for (const op of ops || []) {
    const result = dispatch(op, ctx);
    results.push(result);
  }

  const diff = {};

  for (const file of Object.keys(virtualFS)) {
    diff[file] = {
      before: snapshots[file] ?? "",
      after: virtualFS[file]
    };
  }

  return {
    dryRun: currentDryRun,
    diff,
    ops: opLog,
    result: results
  };
}
