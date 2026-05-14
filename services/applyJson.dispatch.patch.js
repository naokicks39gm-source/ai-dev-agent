import { opsRegistry } from "./ops/index.js";

export function dispatch(op, ctx) {
  const fn = opsRegistry[op.type];

  if (!fn) {
    return { status: "unknown_op", op };
  }

  return fn(op, ctx);
}
