import { handleClientLog } from "../services/logService.js";

export function logRoute(app) {
  app.post("/log", (req, res) => {
    const result = handleClientLog(req);
    res.json(result);
  });
}
