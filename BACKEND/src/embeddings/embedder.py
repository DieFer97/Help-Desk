import sys
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def main():
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw)
        text = payload.get("text", "").strip()

        if not text:
            print(json.dumps({"error": "Texto vacío"}))
            return

        embedding = model.encode(text).tolist()

        print(json.dumps({"embedding": embedding}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
