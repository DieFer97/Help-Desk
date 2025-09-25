import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config";
import { getEmbedding } from "./embedService";

const QDRANT_URL = process.env.QDRANT_URL!;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY!;
const COLLECTION_NAME = "manual_cistcor";

const client = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

export async function classifyQuery(query: string) {
  const embedding = await getEmbedding(query);

  const searchRes = await client.search(COLLECTION_NAME, {
    vector: embedding,
    limit: 1,
  });

  if (searchRes.length === 0) {
    return {
      tipo: "complejo",
      respuesta:
        "Lo siento, pero soy un asistente especializado en el sistema de facturación de CISTCOR, no estoy entrenado para responder ese tipo de consultas.",
      contexto_utilizado: "Sin resultados relevantes en Qdrant",
    };
  }

  const best = searchRes[0];

  if (best.payload?.text) {
    return {
      tipo: "simple",
      respuesta: best.payload.text,
      contexto_utilizado: `Coincidencia en PDF con score ${best.score.toFixed(3)}`,
    };
  }

  return {
    tipo: "complejo",
    respuesta:
      "Esta consulta requiere atención de un humano. Se generará un ticket.",
    contexto_utilizado: "No se encontró texto en el payload de Qdrant",
  };
};
