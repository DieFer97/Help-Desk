import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/classify", async (_req: Request, res: Response) => {
  return res.status(410).json({ error: "Funcionalidad de clasificación por embeddings/Qdrant deshabilitada" });
});

app.listen(PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${PORT}`);
});
