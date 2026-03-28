// app/hooks/useSpeech.ts
import { useRef } from "react";

export function useSpeech(whenBackendResponds: (data: any) => void) {
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
        stream.getTracks().forEach(track => track.stop());

        const blob = new Blob(chunksRef.current, {
          type: "audio/webm;codecs=opus"
        });

        const formData = new FormData();
        formData.append("file", blob);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Voice API failed");
        }

        const data = await res.json();

        whenBackendResponds(data);

        playAudio(data.audio_url, () => {
          startListening();
        });
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 4000);

    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied");
    }
  }

  function playAudio(url: string, onEnded?: () => void) {
    const audio = new Audio(url);

    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
    });

    if (onEnded) {
      audio.onended = onEnded;
    }
  }

  return { startListening };
}