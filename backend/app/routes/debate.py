from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from backend.app import models
from backend.app.database import SessionLocal
from backend.app.utils.gemini_utils import extract_text_from_all_pdfs # We can reuse this
from backend.app.utils.debate_utils import generate_debate_from_text

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/debate")
async def handle_debate_generation(db: Session = Depends(get_db)):
    """
    Generates a debate from the content of all uploaded PDF documents.
    """
    try:
        all_files = db.query(models.FileRecord).all()
        if not all_files:
            raise HTTPException(status_code=404, detail="No PDF documents found to generate a debate from.")

        full_text = extract_text_from_all_pdfs(all_files)
        if not full_text:
            raise HTTPException(status_code=404, detail="Could not extract text from any documents.")
            
        debate_json = generate_debate_from_text(full_text)
        
        return JSONResponse(content={"debate": debate_json})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




