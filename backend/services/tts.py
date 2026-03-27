import os
import requests

from dotenv import load_dotenv
load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "gE0owC0H9C8SzfDyIUtB"  

def generate_tts(text: str) -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    response = requests.post(
        url,
        headers={
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg" 
        },
        json={
            "text": text,
            "model_id": "eleven_turbo_v2"
        }
    )

    print("STATUS:", response.status_code)
    print("CONTENT TYPE:", response.headers.get("content-type"))
    print("SIZE:", len(response.content))

    print("ERROR RESPONSE:", response.text)

    return response.content