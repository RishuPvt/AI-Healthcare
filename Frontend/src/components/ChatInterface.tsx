import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { ChatMessage } from './ChatMessage';
import { generateResponse } from '../lib/gemini';

interface Message {
  text: string;
  isAI: boolean;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(true);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { transcript, isListening, startListening, stopListening, setTranscript } = useSpeechRecognition();

  // Function to stop current speech
  const stopCurrentSpeech = () => {
    if (currentSpeech) {
      window.speechSynthesis.cancel();
      setCurrentSpeech(null);
    }
  };

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      stopCurrentSpeech();
    };
  }, []);

  // Stop speech when text-to-speech is turned off
  useEffect(() => {
    if (!textToSpeech) {
      stopCurrentSpeech();
    }
  }, [textToSpeech]);

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
  
    const userMessage: Message = {
      text: inputText,
      isAI: false,
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTranscript('');
    setIsTyping(true);
  
    try {
      const aiResponse = await generateResponse(inputText);
      
      const aiMessage: Message = {
        text: aiResponse,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      if (textToSpeech) {
        stopCurrentSpeech(); // Stop any previous speech
        const speech = new SpeechSynthesisUtterance(aiMessage.text);
        setCurrentSpeech(speech);
        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again.",
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTextToSpeech = () => {
    if (textToSpeech) {
      stopCurrentSpeech();
    }
    setTextToSpeech(!textToSpeech);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-white">
              AI Health Assistant
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={toggleTextToSpeech}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={textToSpeech ? "Turn off text-to-speech" : "Turn on text-to-speech"}
              >
                {textToSpeech ? (
                  <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
            <div className="h-[600px] overflow-y-auto mb-4 scroll-smooth">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message.text}
                    isAI={message.isAI}
                    timestamp={message.timestamp}
                  />
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-[100px]"
                >
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onMouseDown={startListening}
                onMouseUp={stopListening}
                className={`p-3 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type or speak your message..."
                className="flex-1 p-3 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};