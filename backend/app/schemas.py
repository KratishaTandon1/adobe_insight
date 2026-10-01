from pydantic import BaseModel

class FileBase(BaseModel):
    filename: str
    url: str

class FileCreate(FileBase):
    public_id: str

class File(FileBase):
    id: int
    
    class Config:
        from_attributes = True # Changed from orm_mode = True