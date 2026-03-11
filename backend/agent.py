# backend/agent.py
from session_store import get_session

FIELDS = [
    "company_name",
    "industry",
    "revenue",
    "profitability",
    "loan_amount"
]

def process_input(session_id, text):

    session = get_session(session_id)

    session["history"].append(text)

    # Dummy extraction logic (replace later with LLM)
    if "revenue" in text:
        session["data"]["revenue"] = text

    missing = [f for f in FIELDS if f not in session["data"]]

    return {
        "data": session["data"],
        "missing_fields": missing
    }