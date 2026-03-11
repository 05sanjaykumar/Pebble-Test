# backend/agent/intake_agent.py

import os
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


def extract_profile(text):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ]
    )

    content = response.choices[0].message.content

    try:
        data = json.loads(content)
    except:
        data = {}

    return data