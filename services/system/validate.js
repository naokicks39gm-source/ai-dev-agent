export function validate(op) {
  if (!op.type) return "missing type";
  if (!op.file) return "missing file";

  if (op.line && typeof op.line !== "number") {
    return "line must be number";
  }

  return null;
}