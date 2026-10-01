# backend/app/utils/summarizer.py

def generate_insight(section_text: str, persona: str, task: str) -> str:
    # Replace with OpenAI or local LLM later
    return (
        f"As a {persona}, to achieve your goal '{task}', the above section helps by:\n"
        "- Explaining the process step-by-step\n"
        "- Giving detailed technical insights\n"
        "- Highlighting key points relevant to your task\n"
        "This section is highly relevant due to its clarity and completeness."
    )
