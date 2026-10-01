

import os
import requests
from io import BytesIO
import google.generativeai as genai
from PyPDF2 import PdfReader

# This re-uses the configuration from your gemini_utils.py
# Make sure your API key is set there or as an environment variable.

def get_pdf_text(file_records: list) -> str:
    """
    Extracts text from a list of file records by downloading them from their URLs.
    """
    text = ""
    if not file_records:
        return ""

    for record in file_records:
        try:
            print(f"Downloading {record.filename} for chat context...")
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