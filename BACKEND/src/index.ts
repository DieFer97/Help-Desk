import cors from "cors";
import express, { Request, Response } from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

interface N8nResponse {
  respuesta?: string;
}

async function llamarFlujoIA(message: string): Promise<string> {
  try {
    const response = await fetch(
      "http://localhost:5678/webhook/ia-soporte-{endpoint}",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      }
    );

    const data = (await response.json()) as unknown;

    if (typeof data === "object" && data !== null && "respuesta" in data) {
      const typedData = data as N8nResponse;
      return typedData.respuesta || "No pude generar una respuesta en este momento.";
    }

    return "No pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Error al llamar al flujo IA:", error);
    return "No pude generar una respuesta en este momento.";
  }
}

app.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ respuesta: "El campo 'message' es requerido." });
  }

  const respuesta = await llamarFlujoIA(message);

  return res.json({ respuesta });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
