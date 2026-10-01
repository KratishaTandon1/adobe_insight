
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from backend.app import models
from backend.app.database import SessionLocal
from backend.app.utils.chat_utils import get_pdf_text, get_chat_response

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    filenames: Optional[List[str]] = None

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/chat")
async def handle_chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Handles a user's chat question by providing a contextual answer from PDFs stored in the cloud.
    """
    try:
        # 1. Get all file records from the database
        # A more advanced version could filter by request.filenames if needed
        all_files = db.query(models.FileRecord).all()
        if not all_files:
            raise HTTPException(status_code=404, detail="No PDF documents found to answer from.")

        # 2. Get context by downloading and reading the PDFs
        context = get_pdf_text(all_files)
        if not context:
            raise HTTPException(status_code=404, detail="Could not extract text from any documents.")
            
        # 3. Get the answer from Gemini
        answer = get_chat_response(request.question, context)
        
        return {"answer": answer}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))