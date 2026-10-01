# backend/app/models/recommender.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

pdf_data = {}

def store_pdf_data(filename, sections):
    pdf_data[filename] = sections

def recommend_sections(query, top_k=5):
    all_texts = []
    all_meta = []
    for filename, sections in pdf_data.items():
        for section in sections:
            all_texts.append(section["text"])
            all_meta.append({
                "filename": filename,
                "page": section["page"],
                "text": section["text"]
            })

    if not all_texts:
        return []

    tfidf = TfidfVectorizer().fit([query] + all_texts)
    query_vec = tfidf.transform([query])
    sec_vecs = tfidf.transform(all_texts)
    scores = cosine_similarity(query_vec, sec_vecs)[0]

    top_indices = scores.argsort()[-top_k:][::-1]
    return [all_meta[i] for i in top_indices]
