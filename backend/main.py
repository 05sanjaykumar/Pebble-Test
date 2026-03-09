from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS so Next.js can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what a 'Company' looks like
class Company(BaseModel):
    name: str

@app.get("/")
def home():
    return {"message": "Funding Assistant API is Live"}

@app.post("/analyze-company")
async def analyze_company(company: Company):
    # This is where your AI logic will eventually go
    return {
        "received_name": company.name,
        "status": "Processing application for " + company.name
    }