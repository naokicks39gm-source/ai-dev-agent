import fs from "fs";

export function fileEditRoute(app) {
  app.post("/file/edit", (req, res) => {
    const { path, content } = req.body;

    if (!path || !content) {
      return res.json({ error: "missing path or content" });
    }

    try {
      const before = fs.existsSync(path)
        ? fs.readFileSync(path, "utf-8")
        : "";

      fs.writeFileSync(path, content, "utf-8");

      const after = fs.readFileSync(path, "utf-8");

      res.json({
        ok: true,
        before,
        after
      });

    } catch (e) {
      res.json({ error: e.toString() });
    }
  });
}
