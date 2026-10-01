# backend/app/utils/pdf_utils.py

import fitz  # PyMuPDF

def extract_sections_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    sections = []
    for page_num, page in enumerate(doc):
        text = page.get_text()
        if len(text.strip()) > 50:
            sections.append({
                "page": page_num + 1,
                "text": text.strip()
            })
    return sections
