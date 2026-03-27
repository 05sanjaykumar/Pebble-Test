// app/hooks/useChat.ts
import { useState } from "react";
import { sendToBackend } from "../services/api";



export function useChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [documents, setDocuments] = useState<string[]>([]);


   function handleVoiceResponse(data: any) {
    setMessages(prev => [
      ...prev,
      { role: "user", text: data.text },
      { role: "assistant", text: data.next_question }
    ]);

    setProfile(data.profile);
    setDocuments(data.documents);
  }

  async function sendMessage(text: string) {
    setMessages(prev => [...prev, { role: "user", text }]);

    const data = await sendToBackend(text);

    setProfile(data.profile);
    setDocuments(data.documents);

    setMessages(prev => [
      ...prev,
      { role: "assistant", text: data.next_question }
    ]);

  }

  return { messages, sendMessage, profile, documents, handleVoiceResponse };
}