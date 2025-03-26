import { useState, useCallback, useEffect } from 'react';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    setIsListening(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.stop();
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    setTranscript
  };
};