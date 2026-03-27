# backend/services/tts.py

import os
import requests
from dotenv import load_dotenv

load_dotenv()

CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")

def generate_tts(text: str) -> bytes:
    url = "https://api.cartesia.ai/tts"

    response = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {CARTESIA_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "sonic",  # Cartesia default model
            "voice": {
                "mode": "id",
                "id": "en-US-male-1"  # you can change later
            },
            "input": text,
            "format": "mp3"
        }
    )

    if response.status_code != 200:
        print("CARTESIA ERROR:", response.text)
        return b""

    return response.content