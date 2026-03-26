# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import VoiceInput
from session_store import get_session
from agent.intake_agent import extract_profile, next_question, generate_response
from agent.checklist import generate_documents


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/intake")
def intake(data: VoiceInput):
    
    print("data", data)

    session = get_session(data.session_id)

    session["history"].append(data.text)

    extracted = extract_profile(data.text)

    session["profile"].update(
        {k: v for k, v in extracted.items() if v}
    )

    docs = generate_documents(session["profile"])

    question = next_question(session["profile"])

    response_text = generate_response(
        data.text,
        session["profile"],
        question
    )


    return {
        "profile": session["profile"],
        "documents": docs,
        "next_question": response_text
    }