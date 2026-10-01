import os
import base64
import requests
from io import BytesIO
import google.generativeai as genai
from PyPDF2 import PdfReader

def summarize_pdf_content(file_record) -> dict:
    """
    Downloads or decodes a single PDF, extracts its text, and generates a summary.
    Returns a dictionary with the filename and its summary.
    """
    text = ""
    summary = "Could not generate a summary for this file."
    
    try:
        print(f"Processing {file_record.filename} for summarization...")
        if file_record.url and file_record.url.startswith("data:"):
            b64_data = file_record.url.split(",", 1)[1]
            pdf_bytes = base64.b64decode(b64_data)
            pdf_stream = BytesIO(pdf_bytes)
        else:
            response = requests.get(file_record.url)
            response.raise_for_status()
            pdf_stream = BytesIO(response.content)

        reader = PdfReader(pdf_stream)
        
        for page in reader.pages:
            text += page.extract_text() or ""

        # 2. Send extracted text to Gemini for summarization
        if text.strip():
            api_key = os.environ.get("GEMINI_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
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
        summary = f"An error occurred while processing this file: {str(e)}"

    return {
        "filename": file_record.filename,
        "summary": summary
    }