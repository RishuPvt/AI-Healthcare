import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isAI, timestamp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`flex items-start space-x-2 max-w-[70%] ${
          isAI ? 'flex-row' : 'flex-row-reverse space-x-reverse'
        }`}
      >
        <div
          className={`p-1 rounded-full ${
            isAI ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
          }`}
        >
          {isAI ? (
            <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-300" />
          ) : (
            <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          )}
        </div>
        <div
          className={`flex flex-col ${
            isAI ? 'items-start' : 'items-end'
          }`}
        >
          <div
            className={`p-3 rounded-lg backdrop-blur-sm ${
              isAI
                ? 'bg-green-50 dark:bg-green-900/50 text-gray-800 dark:text-gray-100'
                : 'bg-blue-50 dark:bg-blue-900/50 text-gray-800 dark:text-gray-100'
            }`}
          >
            {message}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};