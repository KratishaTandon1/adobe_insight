from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("models/all-MiniLM-L6-v2")

def recommend_sections(persona: str, task: str, all_sections: list):
    query = f"{persona} wants to {task}"
    query_embedding = model.encode(query, convert_to_tensor=True)

    ranked = []
    for section in all_sections:
        section_embedding = model.encode(section["text"], convert_to_tensor=True)
        score = util.pytorch_cos_sim(query_embedding, section_embedding).item()
        ranked.append((score, section))

    top_k = sorted(ranked, key=lambda x: x[0], reverse=True)[:5]
    return [item[1] for item in top_k]
