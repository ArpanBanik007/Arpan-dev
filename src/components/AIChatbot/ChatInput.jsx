import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const SUGGESTED_PROMPTS = [
  "What are Arpan's technical skills?",
  'Tell me about the Near It platform',
  "What is Arpan's education background?",
  'Does Arpan know AWS?',
];

export default function ChatInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-3 border-t border-white/10 bg-background/80 backdrop-blur-md">
      {/* Quick Prompts */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(prompt)}
            disabled={disabled}
            className="flex-shrink-0 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-gray-300 hover:text-white px-2.5 py-1 rounded-full transition-all text-[11px] disabled:opacity-50 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Arpan Bot is thinking...' : "Ask anything about Arpan's portfolio..."}
          disabled={disabled}
          maxLength={500}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="bg-primary hover:bg-sky-400 disabled:bg-gray-800 disabled:text-gray-500 text-white p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-primary/30"
          title="Send message"
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
}
