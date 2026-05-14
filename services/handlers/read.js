import { logger } from "../../logger.js";

export function handleRead(ctx, op) {
  const file = ctx.normalize(op.file);

  log(ctx, "read:start", { file });

  const content = ctx.read(file);

  return {
    type: "read",
    file: op.file,
    status: "read",
    content,
  };
}
