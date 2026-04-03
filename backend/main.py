# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from session_store import get_session
from agent.intake_agent import extract_profile, next_question, generate_response
from agent.checklist import generate_documents

from fastapi import UploadFile, File
from fastapi.staticfiles import StaticFiles
import tempfile
import os

from services.stt import transcribe_audio
from services.tts import generate_tts

import uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Read allowed origins from env — supports both local dev and Vercel
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Base URL for serving audio files — set to Railway URL in production
BASE_URL = os.getenv("RAILWAY_PUBLIC_URL", "http://localhost:8000")

@app.post("/voice")
async def voice(file: UploadFile = File(...)):

    # 1. Save temp audio
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    # 2. 🎤 STT (Whisper)
    user_text = transcribe_audio(tmp_path)

    # 3. 🧠 Existing pipeline
    session = get_session("demo")

    extracted = extract_profile(user_text)
    session["profile"].update({k: v for k, v in extracted.items() if v})

    docs = generate_documents(session["profile"])
    question = next_question(session["profile"])

    response_text = generate_response(
        user_text,
        session["profile"],
        question
    )

    # 4. 🔊 TTS (Cartesia)
    audio_bytes = generate_tts(response_text)

    # 5. Save audio
    os.makedirs("static", exist_ok=True)
    file_name = f"response_{uuid.uuid4().hex}.mp3"
    file_path = f"static/{file_name}"

    print("AUDIO URL:", f"{BASE_URL}/{file_path}")

    with open(file_path, "wb") as f:
        f.write(audio_bytes)

    # 6. Return everything
    return {
        "user_text": user_text,
        "assistant_text": response_text,
        "audio_url": f"{BASE_URL}/{file_path}",
        "profile": session["profile"],
        "documents": docs
    }
