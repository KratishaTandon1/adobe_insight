from sqlalchemy import Column, Integer, String
from .database import Base

class FileRecord(Base):
    __tablename__ = "pdf_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True, unique=True)
    url = Column(String, unique=True)
    public_id = Column(String, unique=True) # Cloudinary's ID for deletion