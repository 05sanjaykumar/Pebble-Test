# backend/session_store.py
sessions = {}

def get_session(session_id):
    if session_id not in sessions:
        sessions[session_id] = {
            "history": [],
            "data": {}
        }
    return sessions[session_id]