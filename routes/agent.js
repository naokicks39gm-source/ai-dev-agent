import { handleAgent } from "../agent/agentCore.js";

export function agentRoute(app) {
  app.post("/agent", (req, res) => {
    const result = handleAgent(req);
    res.json(result);
  });
}
