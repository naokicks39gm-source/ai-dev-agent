import { logger } from "../../logger.js";

export function handleSearch(ctx, op) {
  const file = ctx.normalize(op.file);
  const content = ctx.read(file);

  log(ctx, "search:start", { file });

  const matches = content.match(new RegExp(op.query, "g")) ?? [];

  return {
    type: "search",
    file: op.file,
    status: "found",
    matches,
  };
}
