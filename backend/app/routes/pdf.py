

import os
from vercel_blob import put
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.database import SessionLocal

# --- VERCEL BLOB CONFIGURATION ---
# It's best to set this as an environment variable.
# For now, paste the token you copied from your Vercel dashboard.

os.environ['BLOB_READ_WRITE_TOKEN'] = "vercel_blob_rw_lRpOck4gSr9uHxdX_KqlJBVMOng0TVXyKgJi79nayjP8vVL"

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
async def upload_pdfs(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    for file in files:
        # ... (file type and existing file checks)
        try:
            # Vercel Blob requires reading the file into memory first
            file_contents = await file.read()

            # Upload the file to Vercel Blob
            blob_result = put(
                f"pdfs/{file.filename}", # The path in the blob store
                file_contents,
                {'access': 'public'} # Make the file publicly accessible
            )

            # The result directly gives us the public URL
            file_url = blob_result['url']

            db_file = models.FileRecord(
                filename=file.filename,
                url=file_url,
                public_id=file_url # We can use the URL as the ID for deletion
            )
            db.add(db_file)
            db.commit()

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not upload {file.filename}: {str(e)}")

    return JSONResponse(content={"message": "Upload successful"})

@router.get("/list", response_model=List[schemas.File])
async def list_pdfs(db: Session = Depends(get_db)):
    files = db.query(models.FileRecord).all()
    return files

@router.delete("/delete/{filename}")
async def delete_pdf(filename: str, db: Session = Depends(get_db)):
    # Vercel Blob deletion requires the full URL
    from vercel_blob import delete

    db_file = db.query(models.FileRecord).filter(models.FileRecord.filename == filename).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        delete(db_file.url) # Delete from Vercel Blob using the URL
        db.delete(db_file) # Delete from our database
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {str(e)}")

    return {"message": f"{filename} deleted successfully"}