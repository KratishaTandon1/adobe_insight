


from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from backend.app.utils.podcast_utils import generate_podcast_script, convert_text_to_speech

router = APIRouter()

# Define a more structured Pydantic model for the request body
class PodcastRequest(BaseModel):
    context_type: str  # e.g., "insights", "recommendations", "page_content"
    text_content: str

@router.post("/podcast")
async def create_podcast_from_context(request: PodcastRequest):
    """
    Creates a podcast summary from specific context and type provided by the frontend.
    """
    try:
        if not request.text_content:
            raise HTTPException(status_code=400, detail="No text content provided.")

        # 1. Generate podcast script from the provided context and type
        script = generate_podcast_script(request.context_type, request.text_content)

        # 2. Convert script to audio
        audio_url = convert_text_to_speech(script)
        if not audio_url:
            raise HTTPException(status_code=500, detail="Failed to generate audio file.")
            
        # 3. Return the URL to the frontend
        return JSONResponse(content={"audio_url": audio_url})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))