import { spawn } from "child_process";
import path from "path";

export async function getEmbedding(text: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [path.join(__dirname, "embedder.py")]);

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(error || "Error running embedder.py"));
      }
      try {
        const parsed = JSON.parse(data);
        resolve(parsed.embedding);
      } catch (e) {
        reject(e);
      }
    });

    py.stdin.write(JSON.stringify({ text }));
    py.stdin.end();
  });
}
