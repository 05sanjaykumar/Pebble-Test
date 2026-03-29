# 🎤 Pebble Voice AI Assistant

An end-to-end Voice AI assistant for collecting business funding information through natural conversation.

This project enables users to speak with an AI assistant, which:
- Converts speech → text (STT)
- Extracts structured business data using LLM
- Responds conversationally
- Converts response → speech (TTS)

---

## 🚀 Features

- 🎤 Voice input using browser microphone
- 🧠 Intelligent conversational flow (LLM-powered)
- 📊 Structured data extraction (company, revenue, etc.)
- 🔊 Natural voice responses (Cartesia TTS)
- 💬 Real-time chat UI
- 📁 Dynamic document checklist generation
- 🧠 Session-based memory (in-memory for now)

---

## 🏗️ Architecture

```

Frontend (Next.js)
↓
FastAPI Backend
↓
STT (Whisper)
↓
LLM (Groq)
↓
TTS (Cartesia)

````

---

## 📂 Project Structure

```
backend/
├── main.py              # FastAPI entry point
├── session_store.py     # In-memory session handling
├── agent/
│   ├── intake_agent.py  # LLM logic + response generation
│   └── checklist.py     # Document generation logic
└── services/
    ├── stt.py           # Speech-to-text (Whisper)
    └── tts.py           # Text-to-speech (Cartesia)

frontend/
├── app/
│   ├── page.tsx         # Main UI
│   ├── components/      # Chat + UI components
│   └── hooks/
│       ├── useSpeech.ts # Mic + audio handling
│       └── useChat.ts   # State management
````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone <your-repo-url>
cd pebble-test
```

---

## 🖥️ Backend Setup

### Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Create `.env`

```env
GROQ_API_KEY=your_groq_key
CARTESIA_API_KEY=your_cartesia_key
```

### Run backend

```bash
uvicorn main:app --reload --port 8000
```

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
```

### Create `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Run frontend

```bash
npm run dev
```

---

## 🎯 How It Works

1. User clicks mic and speaks
2. Audio is recorded and sent to backend
3. STT converts speech → text
4. LLM extracts structured data + generates response
5. TTS converts response → audio
6. Frontend:

   * displays chat
   * plays audio

---

## 🧠 Data Collected

The assistant collects:

* Company Name
* Industry
* Revenue
* Profitability
* Funding Amount
* Funding Purpose

---

## 📄 Document Generation

Based on user inputs, required documents are suggested:

* Bank statements
* P&L statement
* Cap table (for SaaS)

---

## ⚠️ Known Limitations

* Session memory is in-memory (not persistent)
* Fixed recording duration (~4 seconds)
* No real-time streaming (batch processing)
* Single-user session handling

---

## 🚀 Future Improvements

* 🔁 Real-time voice streaming
* 🧠 Persistent memory (DB)
* 🎧 Better voice UX (interrupt + playback control)
* 🌍 Multi-language support
* 📊 Dashboard for collected data

---

## 💡 Tech Stack

* **Frontend:** Next.js, React, Tailwind
* **Backend:** FastAPI (Python)
* **LLM:** Groq (LLaMA 3)
* **STT:** Whisper
* **TTS:** Cartesia

---

## 🙌 Author

**Sanjay Kumar S**

---

## 📌 Note

This project was built as part of a trial assignment and demonstrates a full-stack Voice AI system with real-world API integrations.
