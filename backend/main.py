# main.py
from fastapi import FastAPI
from schemas import VoiceInput
from session_store import get_session
from agent.intake_agent import extract_profile
from agent.checklist import generate_documents

app = FastAPI()

@app.post("/intake")
def intake(data: VoiceInput):

    session = get_session(data.session_id)

    session["history"].append(data.text)

    extracted = extract_profile(data.text)

    session["profile"].update(
        {k: v for k, v in extracted.items() if v}
    )

    docs = generate_documents(session["profile"])

    return {
        "profile": session["profile"],
        "documents": docs,
        "next_question": "Tell me more about your funding needs."
    }