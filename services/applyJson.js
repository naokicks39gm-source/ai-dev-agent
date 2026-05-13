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
}  if (type === "read") {
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

    results.push({ status: "unknown_op", op });
  }

  return results;
}