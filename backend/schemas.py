# backend/schemas.py
from pydantic import BaseModel

class VoiceInput(BaseModel):
    session_id: str
    text: str
