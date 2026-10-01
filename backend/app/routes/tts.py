import os
import uuid
from gtts import gTTS
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Use a relative path that works locally and in Docker
AUDIO_DIR = "generated_audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

class TTSRequest(BaseModel):
    text_to_read: str

@router.post("/tts")
async def handle_text_to_speech(request: TTSRequest):
    """
    A simple endpoint that converts a given text string directly to an MP3 file.
    """
    if not request.text_to_read or len(request.text_to_read) < 10:
        raise HTTPException(status_code=400, detail="Not enough text provided.")

    try:
        tts = gTTS(text=request.text_to_read, lang='en', slow=False)
        filename = f"speech_{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        tts.save(filepath)
        
        # We return the relative path, and the frontend will construct the full URL
        return {"audio_url": f"/audio/{filename}"}

    except Exception as e:
        print(f"Error during TTS generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate audio.")