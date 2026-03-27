// app/hooks/useSpeech.ts
import { useRef } from "react";

export function useSpeech(onResponse: (data: any) => void) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", blob);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        onResponse(data);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 4000);

    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied");
    }
  }

  function playAudio(url: string) {
    new Audio(url).play();
  }

  return { startListening, playAudio };
}