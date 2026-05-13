import { applyJson } from "../services/applyJson.js";

export function applyRoute(app) {
  app.post("/apply", (req, res) => {
    try {
      const result = applyJson(req.body);
      res.json({ ok: true, result });
    } catch (e) {
      res.json({ ok: false, error: e.toString() });
    }
  });
}
