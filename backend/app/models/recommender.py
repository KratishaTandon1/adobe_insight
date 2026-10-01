# backend/app/models/recommender.py

import os
import json
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

pdf_data = {}  # {filename: [sections]}
embedding_cache = {}  # {filename: [embeddings]}

def store_pdf_data(filename, sections):
    pdf_data[filename] = sections
    texts = [sec["text"] for sec in sections]
    embeddings = model.encode(texts, convert_to_tensor=True)
    embedding_cache[filename] = embeddings

def recommend_sections(query, top_k=5):
    query_embedding = model.encode(query, convert_to_tensor=True)

    all_texts = []
    all_meta = []
    for filename, sections in pdf_data.items():
        for i, section in enumerate(sections):
            all_texts.append(section["text"])
            all_meta.append({
                "filename": filename,
                "page": section["page"],
                "text": section["text"]
            })

    section_embeddings = model.encode(all_texts, convert_to_tensor=True)
    cos_scores = util.pytorch_cos_sim(query_embedding, section_embeddings)[0]

    top_indices = cos_scores.topk(top_k).indices.tolist()
    top_sections = [all_meta[i] for i in top_indices]

    # Optional: TF-IDF rerank
    tfidf = TfidfVectorizer().fit([query] + [s["text"] for s in top_sections])
    query_vec = tfidf.transform([query])
    sec_vecs = tfidf.transform([s["text"] for s in top_sections])
    scores = cosine_similarity(query_vec, sec_vecs)[0]

    reranked = sorted(zip(top_sections, scores), key=lambda x: -x[1])
    return [item[0] for item in reranked]
