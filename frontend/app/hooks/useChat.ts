// app/hooks/useChat.ts
import { useState } from "react";
import { sendToBackend } from "../services/api";

export function useChat(speak: (text: string) => void) {
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [documents, setDocuments] = useState<string[]>([]);

  async function sendMessage(text: string) {
    setMessages(prev => [...prev, { role: "user", text }]);

    const data = await sendToBackend(text);

    setProfile(data.profile);
    setDocuments(data.documents);

    setMessages(prev => [
      ...prev,
      { role: "assistant", text: data.next_question }
    ]);

    speak(data.next_question);
  }

  return { messages, sendMessage, profile, documents };
}