from pydantic import BaseModel
from fastapi import APIRouter
import os
import google.generativeai as genai

router = APIRouter()

class SelectionInsightRequest(BaseModel):
    selected_text: str

@router.post("/selection-insight")
async def get_selection_insight(request: SelectionInsightRequest):
    """
    Generates a deep and detailed insight for a specific piece of selected text.
    """
    if not request.selected_text or len(request.selected_text) < 20:
        raise HTTPException(status_code=400, detail="Not enough text selected.")

    try:
        model_name = 'gemini-1.5-flash'
        model = genai.GenerativeModel(model_name)
        
        # --- THIS IS THE NEW, MORE POWERFUL PROMPT ---
        prompt = f"""
        Act as an expert analyst. Your task is to provide a detailed and powerful insight based on the following selected text from a document.

        The insight should not just summarize the text. Instead, it must reveal the deeper meaning, implications, or connections that are not immediately obvious. Focus on the "so what?" of the information provided and explain its significance.

        The final insight should be a well-structured paragraph, approximately 4-5 sentences long.

        Selected Text:
        ---
        {request.selected_text}
        ---
        """
        
        response = model.generate_content(prompt)
        return {"insight": response.text}
        
    except Exception as e:
        # This will print the full, detailed error to your backend terminal.
        print(f"--- DETAILED ERROR IN /selection-insight ---")
        print(e)
        print(f"--- END OF ERROR ---")
        raise HTTPException(status_code=500, detail=str(e))





