


import os
import uuid
from gtts import gTTS
import google.generativeai as genai
import requests

AUDIO_DIR = "generated_audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

def generate_podcast_script(context_type: str, text_content: str) -> str:
    """Uses Gemini to convert a block of provided context into a high-quality podcast script."""
    if not text_content.strip():
        return "There is no content to discuss in this podcast."

    model_name = 'gemini-1.5-flash'
    model = genai.GenerativeModel(model_name)
    
    # --- NEW, MORE PROFESSIONAL PROMPTS ---
    if context_type == "insights":
        prompt_instruction = """
        You are a podcast host for 'Insight in Minutes'. Your task is to transform the following AI-generated insights into a polished and engaging audio script.
        
        Structure your script as follows:
        1.  Start with a welcoming intro: "Welcome to Insight in Minutes. Let's break down what we've discovered."
        2.  Discuss the 'Key Insights' in a clear, narrative style. Explain their significance.
        3.  Present the 'Did You Know?' facts as interesting, quick highlights.
        4.  Conclude by summarizing the 'Clarifications', explaining the bigger picture or what might be missing.
        5.  End with: "That's your insight in minutes. Stay curious."
        """
    elif context_type == "recommendations":
        prompt_instruction = """
        You are a podcast host for 'Docu-Dive'. Your task is to synthesize the following list of disconnected text snippets into a single, cohesive, and conversational audio script.
        
        Do not just list the snippets. Your goal is to find the common thread that connects them and weave them into a compelling narrative. Start with a hook, connect the different ideas smoothly, and end with a concluding thought that ties everything together.
        """
    else: # This covers 'page_content' and 'copied_text'
        prompt_instruction = "You are a narrator. Your task is to read the following text aloud in a clear, professional, and engaging voice. Read the text exactly as it is written, without adding any extra commentary."

    prompt = f"""
    {prompt_instruction}

    The final script must be plain text, without any special characters like asterisks or markdown. It should be suitable for a text-to-speech engine and be approximately 2-3 minutes long when spoken.

    Here is the content to use:
    ---
    {text_content}
    ---
    """
    
    try:
        print(f"Generating improved podcast script for context: {context_type}...")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating podcast script: {e}")
        return "There was an error creating the podcast script."

def convert_text_to_speech(text: str) -> str:
    # This function's logic remains the same
    provider = os.environ.get("TTS_PROVIDER", "google").lower()
    filename = f"podcast_{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)
    print(f"Using TTS Provider: {provider}")

    if provider == "azure":
        # This block will run during the official evaluation
        azure_key = os.environ.get("AZURE_TTS_KEY")
        azure_endpoint = os.environ.get("AZURE_TTS_ENDPOINT")
        if not all([azure_key, azure_endpoint]):
            raise ValueError("Azure TTS credentials (AZURE_TTS_KEY, AZURE_TTS_ENDPOINT) are not set in the environment.")
        
        headers = {
            "Ocp-Apim-Subscription-Key": azure_key,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
            "User-Agent": "pdf-insight-hackathon"
        }
        # We create a simple SSML body to wrap the text
        ssml_body = f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='en-US-JennyNeural'>{text}</voice></speak>"
        
        response = requests.post(azure_endpoint, headers=headers, data=ssml_body.encode('utf-8'))
        response.raise_for_status()
        
        with open(filepath, 'wb') as audio_file:
            audio_file.write(response.content)

    else: 
        # This block will run for your local development, using Google's TTS
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(filepath)
        
    return f"/audio/{filename}"
