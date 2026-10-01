from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from backend.app import models
from backend.app.database import SessionLocal
from backend.app.utils.summarizer_utils import summarize_pdf_content

router = APIRouter()

class SummarizeRequest(BaseModel):
    filenames: List[str]

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/summarize")
async def handle_summarization(request: SummarizeRequest, db: Session = Depends(get_db)):
    """
    Accepts a list of filenames, finds them in the database,
    and returns a summary for each.
    """
    summaries = []
    
    # Find all the requested file records in the database in one query
    file_records = db.query(models.FileRecord).filter(models.FileRecord.filename.in_(request.filenames)).all()
    
    if not file_records:
        raise HTTPException(status_code=404, detail="None of the requested files were found in the database.")

    for record in file_records:
        summary_data = summarize_pdf_content(record)
        summaries.append(summary_data)
        
    return {"summaries": summaries}