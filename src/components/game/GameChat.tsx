import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';

interface GameChatProps {
  messages: Array<{
    id: string;
    playerId: string;
    playerName: string;
    text: string;
    timestamp: number;
  }>;
  onSendMessage: (text: string) => void;
}

const GameChat: React.FC<GameChatProps> = ({ messages, onSendMessage }) => {
  const { t } = useTranslation();
  const { user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl mb-4 w-80 h-96 flex flex-col"
          >
            <div className="p-4 border-b dark:border-gray-700 font-medium">
              {t('chat')}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.playerId === user?.id ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {msg.playerName}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      msg.playerId === user?.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('typeMessage')}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-indigo-600 text-white p-2 rounded-lg
                    hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg transition-colors
          ${isOpen
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
};

export default GameChat; 