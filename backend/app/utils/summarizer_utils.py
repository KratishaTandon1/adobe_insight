import os
import requests
from io import BytesIO
import google.generativeai as genai
from PyPDF2 import PdfReader

# This re-uses the configuration from your gemini_utils.py
# Make sure your API key is set there or as an environment variable.

def summarize_pdf_content(file_record) -> dict:
    """
    Downloads a single PDF, extracts its text, and generates a summary.
    Returns a dictionary with the filename and its summary.
    """
    text = ""
    summary = "Could not generate a summary for this file."
    
    try:
        # 1. Download the PDF content from its public URL
        print(f"Downloading {file_record.filename} for summarization...")
        response = requests.get(file_record.url)
        response.raise_for_status()
        
        pdf_stream = BytesIO(response.content)
        reader = PdfReader(pdf_stream)
        
        for page in reader.pages:
            text += page.extract_text() or ""

        # 2. If text was extracted, send it to Gemini for summarization
        if text.strip():
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            Summarize the following text content from the document named '{file_record.filename}'.
            The summary should be beautiful, well-formatted, and a maximum of 10 lines.

            **Content:**
            ---
            {text}
            ---
            """
            
            gemini_response = model.generate_content(prompt)
            summary = gemini_response.text

    except Exception as e:
        print(f"Error during summarization of {file_record.filename}: {e}")
        summary = "An error occurred while processing this file."

    return {
        "filename": file_record.filename,
        "summary": summary
    }