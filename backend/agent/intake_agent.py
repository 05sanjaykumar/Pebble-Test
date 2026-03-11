# agent/intake_agent.py
from openai import OpenAI
import json

client = OpenAI()

SYSTEM_PROMPT = """
You are a lending intake assistant.

Extract borrower information from the conversation.

Return JSON with fields:
company_name
industry
revenue
profitability
funding_amount
funding_purpose
"""

def extract_profile(text):

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ],
        response_format={"type": "json_object"}
    )

    data = json.loads(response.choices[0].message.content)

    return data