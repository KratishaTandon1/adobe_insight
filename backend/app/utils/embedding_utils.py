import os
import re
import json
import requests
import fitz  # PyMuPDF
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai

def extract_sections(file_records: list):
    """
    Accepts a list of file records from the database, downloads each PDF,
    and extracts its text sections.
    """
    sections = []

    for record in file_records:
        try:
            print(f"Downloading {record.filename} for analysis...")
            response = requests.get(record.url)
            response.raise_for_status()
            pdf_content = response.content

            doc = fitz.open(stream=pdf_content, filetype="pdf")
            
            for page in doc:
                text = page.get_text()
                if len(text.strip()) > 100:
                    sections.append({
                        "text": text.strip(),
                        "source": record.filename,
                        "page": page.number + 1,
                        "source_url": record.url
                    })
            doc.close()
        except Exception as e:
            print(f"Failed to process {record.filename}: {e}")
            
    return sections

def find_related_sections(persona, task, sections, top_k=5):
    """
    Finds and ranks related sections using TF-IDF cosine similarity
    and optional Gemini LLM re-ranking (lightweight and fast).
    """
    if not sections:
        return []

    query = f"As a {persona}, I want to {task}"
    texts = [s["text"] for s in sections]

    try:
        vectorizer = TfidfVectorizer(stop_words='english').fit_transform([query] + texts)
        vectors = vectorizer.toarray()
        query_vec = vectors[0:1]
        doc_vecs = vectors[1:]
        scores = cosine_similarity(query_vec, doc_vecs)[0]

        for idx, section in enumerate(sections):
            section["score"] = float(scores[idx])

        sections.sort(key=lambda x: x["score"], reverse=True)
        top_candidates = sections[:max(top_k * 2, 10)]

        # Try Gemini refinement if API key is available
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            try:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                snippets = [f"[{i}] {s['text'][:200]}" for i, s in enumerate(top_candidates)]
                prompt = f"Persona: {persona}\nTask: {task}\nSnippets:\n" + "\n".join(snippets) + "\n\nReturn JSON array of relevance scores from 0.0 to 1.0 for each snippet in order, e.g. [0.9, 0.7, ...]"
                response = model.generate_content(prompt)
                match = re.search(r'\[[\d\.\s,]+\]', response.text)
                if match:
                    parsed_scores = json.loads(match.group(0))
                    for i, score in enumerate(parsed_scores):
                        if i < len(top_candidates):
                            top_candidates[i]["score"] = float(score)
                    top_candidates.sort(key=lambda x: x["score"], reverse=True)
            except Exception as ge:
                print(f"Gemini re-rank fallback: {ge}")

        return top_candidates[:top_k]

    except Exception as e:
        print(f"Error in find_related_sections: {e}")
        return sections[:top_k]