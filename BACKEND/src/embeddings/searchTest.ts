import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config";
import { getEmbedding } from "./embedService";

const QDRANT_URL = process.env.QDRANT_URL as string;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY as string;
const COLLECTION = "manual_cistcor";

async function main() {
  const client = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
  });

  const query = "¿Cómo crear un cliente sin DNI?";
  console.log("🔎 Consulta:", query);

  const embedding = await getEmbedding(query);

  const results = await client.search(COLLECTION, {
    vector: embedding,
    limit: 3,
  });

  console.log("\n📌 Resultados:");
  results.forEach((res, i) => {
    console.log(`\n#${i + 1} (score: ${res.score.toFixed(3)})`);
    console.log(res.payload?.text);
  });
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
