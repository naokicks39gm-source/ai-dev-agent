import fs from "fs";

export function handleAppend(ctx, op) {
  console.log("CTX_IN_HANDLER", ctx);
  console.log("SAFE_TYPE", typeof ctx.safe);
  const file = ctx.safe(op.file);
  ctx.write(file, op.content ?? op.after ?? "");

 return {
  type: "append",
  file: op.file,
  status: "appended"
};
}
