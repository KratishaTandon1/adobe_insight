import os
import base64
from vercel_blob import put, delete
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.database import SessionLocal

if 'BLOB_READ_WRITE_TOKEN' not in os.environ or not os.environ['BLOB_READ_WRITE_TOKEN']:
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
        try:
            file_contents = await file.read()
            file_url = None

            # 1. Try Vercel Blob upload
            try:
                blob_result = put(
                    f"pdfs/{file.filename}",
                    file_contents,
                    {'access': 'public'}
                )
                file_url = blob_result.get('url')
            except Exception as blob_err:
                print(f"Vercel blob upload failed, using Data URL fallback: {blob_err}")

            # 2. Fallback to Data URL if Blob store is unavailable/unconfigured
            if not file_url:
                b64_str = base64.b64encode(file_contents).decode('utf-8')
                file_url = f"data:application/pdf;base64,{b64_str}"

            # 3. Store record in Database (remove existing duplicate if present)
            existing = db.query(models.FileRecord).filter(models.FileRecord.filename == file.filename).first()
            if existing:
                db.delete(existing)
                db.commit()

            db_file = models.FileRecord(
                filename=file.filename,
                url=file_url,
                public_id=file.filename
            )
            db.add(db_file)
            db.commit()

        except Exception as e:
            print(f"Error during upload of {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"Could not upload {file.filename}: {str(e)}")

    return JSONResponse(content={"message": "Upload successful"})

@router.get("/list", response_model=List[schemas.File])
async def list_pdfs(db: Session = Depends(get_db)):
    files = db.query(models.FileRecord).all()
    return files

@router.delete("/delete/{filename}")
async def delete_pdf(filename: str, db: Session = Depends(get_db)):
    db_file = db.query(models.FileRecord).filter(models.FileRecord.filename == filename).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        if db_file.url and db_file.url.startswith("http"):
            try:
                delete(db_file.url)
            except Exception as e:
                print(f"Could not delete from Vercel Blob: {e}")
        db.delete(db_file)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {str(e)}")

    return {"message": f"{filename} deleted successfully"}