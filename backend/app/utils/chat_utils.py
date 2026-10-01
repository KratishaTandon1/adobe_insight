

import os
import requests
from io import BytesIO
import google.generativeai as genai
from PyPDF2 import PdfReader

# This re-uses the configuration from your gemini_utils.py
# Make sure your API key is set there or as an environment variable.

import base64

def get_pdf_text(file_records: list) -> str:
    """
    Extracts text from a list of file records by downloading them from their URLs or decoding Data URLs.
    """
    text = ""
    if not file_records:
        return ""

    for record in file_records:
        try:
            print(f"Processing {record.filename} for chat context...")
            if record.url and record.url.startswith("data:"):
                b64_data = record.url.split(",", 1)[1]
                pdf_bytes = base64.b64decode(b64_data)
                pdf_stream = BytesIO(pdf_bytes)
            else:
                response = requests.get(record.url)
                response.raise_for_status()
                pdf_stream = BytesIO(response.content)

            reader = PdfReader(pdf_stream)
            
            text += f"\n\n--- Content from: {record.filename} ---\n"
            for page in reader.pages:
                text += page.extract_text() or ""
        except Exception as e:
            print(f"Error reading {record.filename} for chat: {e}")

    return text

def get_chat_response(question: str, context: str) -> str:
    """
    Gets a contextual answer from Gemini based on the user's question and PDF text.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)

    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are a helpful assistant. Answer the following question based *only* on the provided context from PDF documents.
    If the answer is not found in the context, say "I'm sorry, I couldn't find an answer to that in the provided documents."

    **Context from documents:**
    ---
    {context}
    ---

    **Question:**
    {question}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API in chat: {e}")
        return "Sorry, an error occurred while trying to answer your question."