import { handleWrite } from "../handlers/write.js";

export function write(ctx, op) {
  const result = handleWrite(op, ctx);

  ctx.log.push({
    op: "write",
    file: op.file,
    before: result.before,
    after: result.after,
  });

  return {
    type: "write",
    file: op.file,
    content: op.content,
  };
}