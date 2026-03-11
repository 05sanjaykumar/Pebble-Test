# backend/schemas.py
from pydantic import BaseModel
from typing import Optional, List

class VoiceInput(BaseModel):
    session_id: str
    text: str


class BorrowerProfile(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    revenue: Optional[str] = None
    profitability: Optional[str] = None
    funding_amount: Optional[str] = None
    funding_purpose: Optional[str] = None


class IntakeResponse(BaseModel):
    profile: BorrowerProfile
    documents: List[str]
    next_question: Optional[str]