import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe_audio(file_path: str) -> str:
    with open(file_path, "rb") as audio:
        transcription = client.audio.transcriptions.create(
            file=audio,
            model="whisper-large-v3"
        )

    return transcription.text