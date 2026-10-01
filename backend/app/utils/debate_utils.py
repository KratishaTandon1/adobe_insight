import os
import google.generativeai as genai
import json

def generate_debate_from_text(text_content: str) -> str:
    """
    Uses Gemini to identify a nuanced topic in the text and generate two
    opposing arguments with evidence, returned as a JSON string.
    """
    if not text_content.strip():
        return '{}'

    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    Analyze the following text content from one or more documents. Your task is to perform the following steps:
    1. Identify a single, interesting, and nuanced topic from the text that can be debated.
    2. Create a concise title for this debate topic.
    3. Construct two opposing arguments on this topic: one "FOR" and one "AGAINST".
    4. For each argument, provide at least two distinct points.
    5. For each point, you MUST cite a short, specific sentence or phrase from the provided text as evidence.

    Return the entire response as a single, valid JSON object. The JSON object must have the following structure:
    {{
      "topic": "The debate title you created",
      "argument_for": [
        {{ "point": "Your first point for the argument.", "evidence": "The exact quote from the text that supports this point." }},
        {{ "point": "Your second point for the argument.", "evidence": "The exact quote from the text that supports this point." }}
      ],
      "argument_against": [
        {{ "point": "Your first point against the argument.", "evidence": "The exact quote from the text that supports this point." }},
        {{ "point": "Your second point against the argument.", "evidence": "The exact quote from the text that supports this point." }}
      ]
    }}

    Here is the content:
    ---
    {text_content}
    ---
    """
    
    try:
        print("Sending request to Gemini API for debate generation...")
        response = model.generate_content(prompt)
        # Clean up the response to ensure it's valid JSON
        cleaned_json_string = response.text.strip().replace("```json", "").replace("```", "")
        print("Received debate from Gemini API.")
        return cleaned_json_string
    except Exception as e:
        print(f"Error generating debate: {e}")
        return f'{{"error": "An error occurred while generating the debate: {str(e)}"}}'



