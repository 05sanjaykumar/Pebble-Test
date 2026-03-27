// app/hooks/useSpeech.ts
import { useRef } from "react";

export function useSpeech(onResult: (text: string) => void) {
  const recognitionRef = useRef<any>(null);

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      onResult(transcript);
    };

    recognition.start();
  }

  function speak(text: string) {
    speechSynthesis.cancel();
    recognitionRef.current?.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      recognitionRef.current?.start();
    };
  }

  return { startListening, speak };
}