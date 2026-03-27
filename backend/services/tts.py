# backend/services/tts.py

import os
import requests
from dotenv import load_dotenv

load_dotenv()

CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")

# Default voice: "Barbershop Man" (en) — swap this from play.cartesia.ai/voices
DEFAULT_VOICE_ID = "f786b574-daa5-4673-aa0c-cbe3e8534c02"


def generate_tts(text: str, voice_id: str = DEFAULT_VOICE_ID) -> bytes:
    url = "https://api.cartesia.ai/tts/bytes"

    response = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {CARTESIA_API_KEY}",
            "Content-Type": "application/json",
            "Cartesia-Version": "2026-03-01",
        },
        json={
            "model_id": "sonic-3",           # ✅ was "model": "sonic"
            "transcript": text,               # ✅ was "input": text
            "voice": {
                "mode": "id",
                "id": voice_id,               # ✅ was "en-US-male-1" (not a valid UUID)
            },
            "output_format": {                # ✅ was missing entirely (required field)
                "container": "wav",
                "encoding": "pcm_s16le",
                "sample_rate": 44100,
            },
            "language": "en",
        },
        timeout=20,
    )

    print("🔊 CARTESIA STATUS:", response.status_code)

    if response.status_code != 200:
        print("❌ CARTESIA ERROR:", response.text)
        return b""

    audio_bytes = response.content

    if not audio_bytes or len(audio_bytes) < 100:
        print("❌ Empty audio received")
        return b""

    print("✅ Audio size:", len(audio_bytes), "bytes")

    return audio_bytes
