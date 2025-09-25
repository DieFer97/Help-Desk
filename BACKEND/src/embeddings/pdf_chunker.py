import sys
import json
import pdfplumber
import os

CHUNK_SIZE = 500
OVERLAP = 100

def chunk_text(text, size=CHUNK_SIZE, overlap=OVERLAP):
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += size - overlap
    return chunks

def main(pdf_path, output_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    chunks = chunk_text(text)

    data = {"chunks": chunks}
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ Chunks guardados en {output_path} ({len(chunks)} fragmentos)")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python pdf_chunker.py <ruta_pdf> <salida_json>")
        sys.exit(1)
    pdf_path = sys.argv[1]
    output_path = sys.argv[2]
    main(pdf_path, output_path)
