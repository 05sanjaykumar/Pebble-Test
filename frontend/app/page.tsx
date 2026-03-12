"use client";

import React from 'react';
import { useState, useRef } from "react";
import { 
  Mic, 
  Building2, 
  Factory, 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Target, 
  Circle 
} from 'lucide-react';

export default function FundingAssistant() {

  const [profile, setProfile] = useState({});
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null)

  async function sendMessage(text: string) {

    setMessages(prev => [...prev, { role: "user", text }]);

    const res = await fetch("http://localhost:8000/intake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_id: "demo",
        text
      })
    });

    const data = await res.json();

    setProfile(data.profile);
    setDocuments(data.documents);

    setMessages(prev => [
      ...prev,
      { role: "assistant", text: data.next_question }
    ]);

    speak(data.next_question);
  }

  function startListening() {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognitionRef.current = recognition


    recognition.onstart = () => {
      console.log("🎤 Listening continuously...")
    }

    recognition.onresult = async (event: any) => {

      const transcript =
        event.results[event.results.length - 1][0].transcript

      console.log("User said:", transcript)

      await sendMessage(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error)
    }

    recognition.onend = () => {
      if (!speechSynthesis.speaking) {
        console.log("Restarting listening...")
        recognition.start()
      }
    }

    recognition.start()
  }

  function speak(text: string) {

    speechSynthesis.cancel();

    // stop mic while assistant speaks
    recognitionRef.current?.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();

    const preferred =
      voices.find(v => v.name.includes("Alex")) ||
      voices[0];

    utterance.voice = preferred;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      console.log("Assistant speaking...");
    }

    utterance.onend = () => {

      console.log("Assistant finished speaking");

      if (!speechSynthesis.speaking) {
        recognitionRef.current?.start();
      }
    };

    speechSynthesis.speak(utterance);
  }
  return (
    // h-screen and overflow-hidden prevent the whole page from scrolling
    <div className="h-screen flex flex-col bg-slate-50 p-6 md:p-8 font-sans text-slate-900 overflow-hidden">
      
      {/* Header - Compacted margin to save space */}
      <header className="max-w-7xl mx-auto w-full mb-6 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">P</div>
          <span className="font-semibold text-slate-700 text-sm">Pebble</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Funding Application Assistant</h1>
        <p className="text-slate-500 text-sm">Tell us about your business and funding needs.</p>
      </header>

      {/* Main Content Area - flex-1 and min-h-0 are key here */}
      <main className="max-w-7xl mx-auto w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Chat Interface */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-500">Funding Assistant</span>
          </div>

          {/* Chat Body - This area alone will scroll if text is long */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white border border-slate-100"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}

          </div>

          {/* Chat Input Area */}
          <div className="p-4 border-t border-slate-50 flex justify-center shrink-0">
            <button 
            onClick={startListening}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-95">
              <Mic size={20} />
            </button>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="flex flex-col gap-4 min-h-0">
          
          {/* Borrower Profile Card - flex-1 to take space */}
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-0">
            <h2 className="font-bold text-md mb-4 text-slate-800 shrink-0">Borrower Profile</h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              <ProfileItem icon={<Building2 size={16}/>} label="Company Name" />
              <ProfileItem icon={<Factory size={16}/>} label="Industry" />
              <ProfileItem icon={<DollarSign size={16}/>} label="Revenue Last Year" />
              <ProfileItem icon={<TrendingUp size={16}/>} label="Profitability Status" />
              <ProfileItem icon={<Wallet size={16}/>} label="Funding Amount" />
              <ProfileItem icon={<Target size={16}/>} label="Funding Purpose" />
            </div>
          </section>

          {/* Documents Needed Card - shrink-0 to stay at bottom */}
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 shrink-0">
            <h2 className="font-bold text-md mb-3 text-slate-800">Documents Needed</h2>
            <ul className="space-y-3">
              <DocumentItem label="Bank statements (12m)" />
              <DocumentItem label="Latest P&L statement" />
              <DocumentItem label="Cap table" />
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}

function ProfileItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-50 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 truncate">{label}</p>
        <p className="text-xs font-medium text-slate-300">Pending...</p>
      </div>
    </div>
  );
}

function DocumentItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-600 group cursor-pointer">
      <Circle size={16} className="text-slate-300 shrink-0" />
      <span className="text-xs font-medium truncate">{label}</span>
    </li>
  );
}