// frontend/app/page.tsx
"use client";

import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { useSpeech } from "./hooks/useSpeech";
import { useChat } from "./hooks/useChat";

export default function Page() {

  const { messages, profile, documents, handleVoiceResponse } = useChat();

  const { startListening } = useSpeech((data) => {
    handleVoiceResponse(data);
  });

  return (
    <div className="h-screen flex flex-col bg-slate-50 p-6 md:p-8 font-sans text-slate-900 overflow-hidden">
      
      {/* Header (RESTORED) */}
      <header className="max-w-7xl mx-auto w-full mb-6 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
          <span className="font-semibold text-slate-700 text-sm">Pebble</span>
        </div>
        <h1 className="text-3xl font-bold">Funding Application Assistant</h1>
        <p className="text-slate-500 text-sm">
          Tell us about your business and funding needs.
        </p>
      </header>

      {/* Main Layout (RESTORED GRID) */}
      <main className="max-w-7xl mx-auto w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chat */}
        <div className="lg:col-span-2 min-h-0">
          <Chat 
            messages={messages} 
            startListening={startListening} 
          />
        </div>

        {/* Sidebar */}
        <Sidebar 
          profile={profile} 
          documents={documents} 
        />

      </main>
    </div>
  );
}