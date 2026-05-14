import { opsRegistry } from "./ops/index.js";

export function dispatch(op, ctx) { console.log("CTX_IN_DISPATCH", ctx);
  const fn = opsRegistry[op.type];

  if (!fn) {
    return { status: "unknown_op", op };
  }

  console.log("CTX_IN_DISPATCH", ctx); console.log("OP", op); return fn(ctx, op);
}
