import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { classifyQuery } from "./embeddings/classifier";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/classify", async (req: Request, res: Response) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ error: "Falta campo 'message' en el body" });
    }

    const result = await classifyQuery(message);

    return res.json(result);
  } catch (err: any) {
    console.error("ERROR /api/classify:", err);
    return res.status(500).json({ error: err?.message ?? "Error interno" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${PORT}`);
});
