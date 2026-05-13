import fs from "fs";

export function handleSearch(op, safe) {
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

  return {
    file: op.file,
    matches
  };
}