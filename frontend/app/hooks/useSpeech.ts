// app/hooks/useSpeech.ts
import { useRef } from "react";

export function useSpeech(whenBackendResponds: (data: any) => void) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // ✅ analyse audio volume
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 512;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();

        // ✅ check if user actually spoke something
        const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" });

        if (blob.size < 10000) {
          // too small — likely silence, just start listening again
          console.log("silence detected, skipping...");
          startListening();
          return;
        }

        const formData = new FormData();
        formData.append("file", blob);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/voice`,
          { method: "POST", body: formData }
        );

        if (!res.ok) throw new Error("Voice API failed");

        const data = await res.json();

        // ✅ skip if transcript is empty or too short
        if (!data.user_text || data.user_text.trim().length < 3) {
          console.log("empty transcript, skipping...");
          startListening();
          return;
        }

        whenBackendResponds(data);

        playAudio(data.audio_url, () => {
          startListening();
        });
      };

      mediaRecorder.start();

      // ✅ stop early if silence detected, max 5s
      let silenceTimer: any = null;
      let hasSpeech = false;

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume > 20) {
          hasSpeech = true;
          if (silenceTimer) clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => mediaRecorder.stop(), 1500);
          // ↑ stop 1.5s after user goes quiet
        }

        if (mediaRecorder.state === "recording") {
          requestAnimationFrame(checkVolume);
        }
      };

      requestAnimationFrame(checkVolume);

      // ✅ hard limit of 8s no matter what
      setTimeout(() => {
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }, 8000);

    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied");
    }
  }

  function playAudio(url: string, onEnded?: () => void) {
    const audio = new Audio(url);
    audio.play().catch(err => console.error("Audio play failed:", err));
    if (onEnded) audio.onended = onEnded;
  }

  return { startListening };
}