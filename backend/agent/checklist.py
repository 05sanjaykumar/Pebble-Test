# backend/agent/checklist.py
def generate_documents(profile):

    docs = []

    funding = profile.get("funding_amount")

    docs.append("Bank statements (12 months)")

    if funding:
        docs.append("Latest P&L statement")

    if profile.get("industry") == "SaaS":
        docs.append("Cap table")

    return docs