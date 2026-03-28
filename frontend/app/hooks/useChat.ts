// app/hooks/useChat.ts
import { useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [documents, setDocuments] = useState<string[]>([]);

   function handleVoiceResponse(data: any) {
    setMessages(prev => [
      ...prev,
      { role: "user", text: data.user_text },
      { role: "assistant", text: data.assistant_text }
    ]);


    // console.log("data handled by the frontend", data);

    setProfile(data.profile);
    setDocuments(data.documents);
  }

  return { messages, profile, documents, handleVoiceResponse };
}