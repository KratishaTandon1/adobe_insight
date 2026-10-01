


import os
import requests
from sentence_transformers import SentenceTransformer, util
import fitz  # PyMuPDF

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def extract_sections(file_records: list):
    """
    Accepts a list of file records from the database, downloads each PDF,
    and extracts its text sections.
    """
    sections = []

    for record in file_records:
        try:
            # 1. Download the PDF content from the public URL
            print(f"Downloading {record.filename} for analysis...")
            response = requests.get(record.url)
            response.raise_for_status()  # Raise an exception for bad status codes
            pdf_content = response.content

            # 2. Open the downloaded PDF from memory
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            
            # 3. Process the document to extract sections
            for page in doc:
                text = page.get_text()
                if len(text.strip()) > 100:
                    sections.append({
                        "text": text.strip(),
                        "source": record.filename,
                        "page": page.number + 1,
                        "source_url": record.url  # CRUCIAL: Add the URL for the frontend
                    })
            doc.close()
        except Exception as e:
            print(f"Failed to process {record.filename}: {e}")
            
    return sections

def find_related_sections(persona, task, sections, top_k=5):
    """
    This function's core logic remains unchanged. It will automatically
    preserve the 'source_url' field in the results.
    """
    query = f"As a {persona}, I want to {task}"
    query_embedding = model.encode(query, convert_to_tensor=True)

    results = []
    for section in sections:
        section_embedding = model.encode(section["text"], convert_to_tensor=True)
        score = float(util.pytorch_cos_sim(query_embedding, section_embedding)[0][0])
        section.update({"score": score})
        results.append(section)

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]