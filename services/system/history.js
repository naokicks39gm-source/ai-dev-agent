const history = [];

export function pushHistory(op, before) {
  history.push({ op, before });
}

export function popHistory() {
  return history.pop();
}