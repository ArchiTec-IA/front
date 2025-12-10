/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
}

export function useSpeechRecognition(
  onResult: (transcript: string) => void
): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Verifica a disponibilidade da API
  const SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recognition = new SpeechRecognition();

  if (isSupported) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "pt-BR";
  }

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Reconhecimento de voz não suportado neste navegador.");
      return;
    }
    if (isListening) return;

    setTranscript("");
    setError(null);

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      onResult(result); // Callback para enviar o resultado ao componente principal
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setError(`Erro de reconhecimento: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Error starting recognition:", e);
      setError("Falha ao iniciar a gravação.");
      setIsListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, isListening, onResult]);

  const stopListening = useCallback(() => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (isListening) {
        recognition.stop();
      }
    };
  }, [recognition, isListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
  };
}
