


import os
import requests
import google.generativeai as genai
from PyPDF2 import PdfReader
from io import BytesIO

# Read the Gemini API key from the environment
try:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    genai.configure(api_key=api_key) 
except Exception as e:
    print(f"Error configuring Gemini API: {e}")

def extract_text_from_all_pdfs(file_records: list) -> str:
    """
    Accepts file records from the database, downloads each PDF from its URL,
    and extracts the text.
    """
    full_text = ""
    print(f"Found {len(file_records)} PDFs from database to process.")

    for record in file_records:
        try:
            print(f"Downloading {record.filename} for insights analysis...")
            response = requests.get(record.url)
            response.raise_for_status()
            
            pdf_stream = BytesIO(response.content)
            reader = PdfReader(pdf_stream)
            
            full_text += f"\n\n--- Content from {record.filename} ---\n"
            for page in reader.pages:
                full_text += page.extract_text() or ""
        except Exception as e:
            print(f"Could not read or extract text from {record.filename}: {e}")
            
    return full_text

def get_insights_from_gemini(text_content: str) -> str:
    """
    Sends the provided text content to the Gemini model specified in the
    environment variables and asks for insights.
    """
    if not text_content.strip():
        return "No text content found in PDFs to generate insights."

    # Read the model name from the environment, with a fallback for local dev
    model_name = 'gemini-1.5-flash'
    model = genai.GenerativeModel(model_name)
    
    prompt = f"""
    Analyze the following text from multiple documents. Based *only* on this text, generate a response in a valid JSON format.
    The JSON object should have three keys: "key_insights", "did_you_know", and "clarifications".
    - "key_insights" should be a single paragraph summary.
    - "did_you_know" should be an array of short, interesting fact strings.
    - "clarifications" should be a single paragraph explaining potential counterpoints or areas lacking detail.

    Here is the content:
    ---
    {text_content}
    ---
    """
    
    try:
        print(f"Sending request to Gemini model: {model_name}...")
        response = model.generate_content(prompt)
        cleaned_json_string = response.text.strip().replace("```json", "").replace("```", "")
        print("Received structured response from Gemini API.")
        return cleaned_json_string
    except Exception as e:
        print(f"Error communicating with Gemini API: {e}")
        return f'{{"error": "An error occurred while generating insights: {str(e)}"}}'




