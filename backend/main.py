from fastapi import FastAPI
from schemas import VoiceInput
from agent import process_input

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Pebble AI Intake API"}

@app.post("/voice")
async def voice_input(data: VoiceInput):
    response = process_input(data.session_id, data.text)
    return response