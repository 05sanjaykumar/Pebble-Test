# backend/agent/intake_agent.py

import os
import re
from dotenv import load_dotenv
from groq import Groq
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


REQUIRED_FIELDS = [
    "company_name",
    "industry",
    "revenue",
    "profitability",
    "funding_amount",
    "funding_purpose"
]

FIELD_QUESTIONS = {
    "company_name": "What is the name of your company?",
    "industry": "What industry do you operate in?",
    "revenue": "What was your revenue last year?",
    "profitability": "Is your company currently profitable?",
    "funding_amount": "How much funding are you seeking?",
    "funding_purpose": "What will you use the funding for?"
}


SYSTEM_PROMPT = """
You are an AI lending intake assistant.

Extract borrower information from the conversation.

Return ONLY valid JSON.

Fields:
company_name
industry
revenue
profitability
funding_amount
funding_purpose

Rules:
- If a field is not mentioned return null
- Do not add explanations
- Output JSON only
"""

def next_question(profile):
    for field in REQUIRED_FIELDS:
        if field not in profile or not profile[field]:
            return FIELD_QUESTIONS[field]
    return "Thanks! We have collected all the required information."

def generate_response(user_text, profile, next_q):
    prompt = f"""
    You are a friendly lending assistant.

    Your job:
    - Acknowledge the user's input naturally
    - Sound warm and conversational
    - Then ask the next question

    User said: "{user_text}"

    Current collected profile:
    {profile}

    Next question to ask:
    "{next_q}"

    Respond like a human (not robotic).
    Keep it short (2-3 sentences max).
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip()


def extract_profile(text):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text}
            ]
        )

        content = response.choices[0].message.content

        if not content:
            return {}

        # Strip markdown code fences if LLM wraps JSON in ```json ... ```
        content = re.sub(r"^```(?:json)?\s*", "", content.strip())
        content = re.sub(r"```\s*$", "", content.strip())

        data = json.loads(content)

        # Ensure we always return a dict
        if not isinstance(data, dict):
            return {}

        return data

    except Exception as e:
        print(f"[extract_profile] failed: {e}")
        return {}
