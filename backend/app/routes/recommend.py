

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import networkx as nx

from backend.app import models
from backend.app.database import SessionLocal
from backend.app.utils.embedding_utils import extract_sections, find_related_sections

router = APIRouter()

class RecommendRequest(BaseModel):
    persona: str
    task: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/related")
def recommend_related(data: RecommendRequest, db: Session = Depends(get_db)):
    try:
        all_files = db.query(models.FileRecord).all()
        if not all_files:
            return {"recommendations": [], "graph_data": {"nodes": [], "links": []}}

        sections = extract_sections(all_files)
        results = find_related_sections(data.persona, data.task, sections, top_k=10) # Get more results for better graph

        # --- NEW: Build the Graph Data ---
        graph = nx.Graph()
        doc_names = {record.filename for record in all_files}
        
        # Add all documents as nodes
        for name in doc_names:
            graph.add_node(name)

        # Create links between documents that appear in the top results
        # A simple way is to link any two docs that have related sections
        source_docs_in_results = {res['source'] for res in results}
        for doc1 in source_docs_in_results:
            for doc2 in source_docs_in_results:
                if doc1 != doc2:
                    graph.add_edge(doc1, doc2)

        # Convert graph to a format for the frontend
        nodes = [{"id": node} for node in graph.nodes()]
        links = [{"source": u, "target": v} for u, v in graph.edges()]
        graph_data = {"nodes": nodes, "links": links}

        return {"recommendations": results[:5], "graph_data": graph_data} # Return top 5 recs + graph

    except Exception as e:
        print(f"An error occurred in /related: {e}")
        raise HTTPException(status_code=500, detail=str(e))