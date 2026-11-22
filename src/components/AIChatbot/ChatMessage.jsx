import React from 'react';
import { FaRobot, FaUser, FaCheckCircle, FaExclamationTriangle, FaBookOpen } from 'react-icons/fa';

/**
 * Render basic markdown-like formatting (bold, bullet points, headers) safely.
 */
function FormattedText({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1">
              <span className="text-primary text-xs mt-1.5">•</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: renderInlineBold(itemText) }} />
            </div>
          );
        }

        // Header / bold line
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return (
            <div key={idx} className="font-semibold text-white pt-1">
              {trimmed.replace(/\*\*/g, '')}
            </div>
          );
        }

        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: renderInlineBold(trimmed) }} />
        );
      })}
    </div>
  );
}

function renderInlineBold(text) {
  // Replace **bold** with <strong>bold</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>');
}

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`flex max-w-[88%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2.5`}>
        {/* Avatar */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
            isUser
              ? 'bg-gradient-to-br from-primary to-sky-600 text-white'
              : 'bg-card border border-primary/40 text-primary shadow-sm'
          }`}
        >
          {isUser ? <FaUser size={12} /> : <FaRobot size={13} />}
        </div>

        {/* Message Bubble */}
        <div
          className={`flex flex-col rounded-2xl p-3.5 ${
            isUser
              ? 'bg-primary/20 border border-primary/40 text-gray-100 rounded-tr-xs'
              : 'bg-card border border-white/10 text-gray-200 rounded-tl-xs shadow-md'
          }`}
        >
          {/* Header info for assistant */}
          {!isUser && (
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/5 text-xs">
              <span className="font-semibold text-sky-400">Arpan Bot</span>
              {message.grounded !== undefined && (
                message.grounded ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <FaCheckCircle size={10} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <FaExclamationTriangle size={10} /> Out of Context
                  </span>
                )
              )}
            </div>
          )}

          {/* Message Content */}
          <FormattedText content={message.text} />

          {/* Source Provenance Pills */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <FaBookOpen size={9} /> Sources:
              </span>
              {message.sources.map((src, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-md hover:border-primary/40 transition-colors"
                  title={`${src.source} › ${src.title || src.section}`}
                >
                  {src.title || src.section}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-[10px] text-gray-500 mt-1.5 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}
