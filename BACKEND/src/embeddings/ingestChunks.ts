import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { getEmbedding } from "./embedService";

const QDRANT_URL = process.env.QDRANT_URL as string;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY as string;
const COLLECTION = "manual_cistcor";

async function main() {
  const client = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
  });

  const data = JSON.parse(fs.readFileSync("embeddings/manual_chunks.json", "utf-8"));
  const chunks: string[] = data.chunks;
  console.log(`📄 ${chunks.length} chunks encontrados`);

  try {
    await client.createCollection(COLLECTION, {
      vectors: { size: 384, distance: "Cosine" },
    });
    console.log("✅ Colección creada");
  } catch (e: any) {
    if (e.response?.status === 409) {
      console.log("ℹ️ Colección ya existe, continuamos...");
    } else {
      throw e;
    }
  }

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i];
    console.log(`➡️ Procesando chunk ${i + 1}/${chunks.length}`);

    const embedding = await getEmbedding(text);

    await client.upsert(COLLECTION, {
      points: [
        {
          id: uuidv4(),
          vector: embedding,
          payload: {
            text,
            chunk_index: i,
            source: "MOTIVOS DE SOPORTE.pdf",
          },
        },
      ],
    });
  }

  console.log("🎉 Ingesta completa en Qdrant");
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
