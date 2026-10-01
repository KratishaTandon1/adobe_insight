


from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from backend.app import models
from backend.app.database import SessionLocal
from backend.app.utils.gemini_utils import extract_text_from_all_pdfs, get_insights_from_gemini

router = APIRouter()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/insights")
async def generate_insights(db: Session = Depends(get_db)):
    """
    Generates deep insights from all uploaded PDF documents
    by fetching their records from the database.
    """
    try:
        # 1. Get all file records from the database
        all_files = db.query(models.FileRecord).all()
        if not all_files:
            raise HTTPException(status_code=404, detail="No PDF documents found in the database.")

        # 2. Extract text by downloading the files via their URLs
        print("Insights endpoint: Starting text extraction from URLs...")
        full_text = extract_text_from_all_pdfs(all_files)
        
        if not full_text:
            raise HTTPException(status_code=404, detail="No text could be extracted from the available PDFs.")

        # 3. Send the combined text to Gemini for analysis
        print("Insights endpoint: Getting insights from Gemini...")
        insights = get_insights_from_gemini(full_text)
        
        return JSONResponse(content={"insights": insights})

    except Exception as e:
        print(f"An error occurred in the /insights endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))