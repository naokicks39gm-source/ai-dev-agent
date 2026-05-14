import { handleWrite } from "../handlers/write.js";
import { handleReplace } from "../handlers/replace.js";
import { handleReplaceLine } from "../handlers/replaceLine.js";
import { handleReplaceSafe } from "../handlers/replaceSafe.js";
import { handleSearch } from "../handlers/search.js";
import { handleRead } from "../handlers/read.js";

import { handleInsert } from "../handlers/insert.js";
import { handleAppend } from "../handlers/append.js";
import { handleDelete } from "../handlers/delete.js";

export const opsRegistry = {
  write: handleWrite,
  replace: handleReplace,
  replace_line: handleReplaceLine,
  replace_safe: handleReplaceSafe,
  search: handleSearch,
  read: handleRead,

  insert: handleInsert,
  append: handleAppend,
  delete: handleDelete
};
