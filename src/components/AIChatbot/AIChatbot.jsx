import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes } from 'react-icons/fa';
import ChatWindow from './ChatWindow';
import './Chatbot.css';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!hasOpenedOnce) setHasOpenedOnce(true);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-4 origin-bottom-right"
          >
            <ChatWindow
              onClose={() => setIsOpen(false)}
              onMinimize={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div className="relative group">
        {/* Recruiter Callout Tooltip (shown initially before open) */}
        {!hasOpenedOnce && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute right-0 bottom-full mb-3 pointer-events-none"
          >
            <div className="bg-card border border-primary/40 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Ask <strong>Arpan Bot</strong> or upload a <strong>Job Description</strong></span>
              <div className="absolute top-full right-6 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-primary/40" />
            </div>
          </motion.div>
        )}

        {/* Trigger Button */}
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer arpan-bot-glow ${
            isOpen
              ? 'bg-zinc-800 border border-white/20 hover:bg-zinc-700'
              : 'bg-gradient-to-br from-primary via-sky-500 to-indigo-600 hover:from-sky-400 hover:to-primary border border-white/20'
          }`}
          aria-label={isOpen ? 'Close Arpan Bot' : 'Open Arpan Bot Portfolio Assistant'}
        >
          {isOpen ? (
            <FaTimes size={18} />
          ) : (
            <div className="relative">
              <FaRobot size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-background rounded-full" />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
}
