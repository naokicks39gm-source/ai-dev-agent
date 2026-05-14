import { handleWrite } from "./write.js";
import { handleAppend } from "./append.js";
import { handleInsert } from "./insert.js";
import { handleDelete } from "./delete.js";
import { handleReplace } from "./replace.js";
import { handleReplaceLine } from "./replace_line.js";
import { handleReplaceSafe } from "./replace_safe.js";
import { handleRead } from "./read.js";
import { handleSearch } from "./search.js";

export const opsRegistry = {
  write: handleWrite,
  append: handleAppend,
  insert: handleInsert,
  delete: handleDelete,
  replace: handleReplace,
  replace_line: handleReplaceLine,
  replace_safe: handleReplaceSafe,
  read: handleRead,
  search: handleSearch,
};
