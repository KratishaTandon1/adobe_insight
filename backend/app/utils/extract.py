import fitz  # PyMuPDF

def process_pdf(file_bytes: bytes, filename: str):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    sections = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        blocks = page.get_text("blocks")
        for block in blocks:
            text = block[4].strip()
            if len(text) > 100:
                sections.append({
                    "page": page_num + 1,
                    "text": text,
                    "source": filename
                })
    return sections
