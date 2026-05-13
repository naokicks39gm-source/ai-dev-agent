import fs from "fs";

export function backup(file) {
  if (!fs.existsSync(file)) return;

  fs.copyFileSync(file, file + ".bak");
}