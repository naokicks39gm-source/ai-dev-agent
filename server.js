import express from "express";
import path from "path";

const app = express();
app.use(express.json());

app.use(express.static(path.resolve(".")));

app.post("/log", (req, res) => {
  console.log("LOG:", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server running");
});