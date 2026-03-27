// app/components/Chat.tsx
import { Mic } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function Chat({ messages, startListening }: any) {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
      {/* Header */}
      <div className="p-3 border-b flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-slate-500">Funding Assistant</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg: any, i: number) => (
          <MessageBubble key={i} msg={msg} />
        ))}
      </div>

      {/* Mic */}
      <div className="p-4 flex justify-center">
        <button
          onClick={startListening}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center"
        >
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
}