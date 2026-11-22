import React, { useState, useRef, useEffect } from 'react';
import {
  FaRobot,
  FaTimes,
  FaMinus,
  FaCommentDots,
  FaFileAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import FileUpload from './FileUpload';
import JDAnalysis from './JDAnalysis';
import { sendChatMessage, analyzeJobDescription, deleteJDSession } from '../../services/chatbotApi';

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'assistant',
  text: "Hello! I am **Arpan Bot**, Arpan Banik's personal portfolio AI assistant.\n\nI can answer questions about Arpan's technical skills, full-stack projects, architecture, and background using verified portfolio data.\n\nYou can also switch to the **JD Analyzer** tab above to upload a Job Description (PDF/DOCX) and see an instant match score out of 100!",
  grounded: true,
  sources: [{ section: 'personal_info', source: 'portfolio.json', title: 'Personal Profile: Arpan Banik' }],
  timestamp: 'Just now',
};

export default function ChatWindow({ onClose, onMinimize }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'jd'
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState(null);

  // JD Analyzer states
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [isAnalyzingJD, setIsAnalyzingJD] = useState(false);
  const [activeJDSessionId, setActiveJDSessionId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  // Clean up session on unmount if any
  useEffect(() => {
    return () => {
      if (activeJDSessionId) {
        deleteJDSession(activeJDSessionId);
      }
    };
  }, [activeJDSessionId]);

  // Handle sending chat message
  const handleSendMessage = async (userText) => {
    setChatError(null);
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(userText);
      const assistantMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        grounded: response.grounded,
        sources: response.sources || [],
        similarity_score: response.similarity_score,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setChatError(err.message || 'Something went wrong. Please try again.');
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Connection Error:** ${err.message || 'Could not communicate with Arpan Bot server.'}`,
        grounded: false,
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle JD analysis trigger from FileUpload
  const handleJDReady = async ({ sessionId, jdText, filename }) => {
    setIsAnalyzingJD(true);
    if (sessionId) setActiveJDSessionId(sessionId);

    try {
      const analysis = await analyzeJobDescription({ sessionId, jdText });
      setJdAnalysis(analysis);
    } catch (err) {
      alert(`JD Analysis Error: ${err.message || 'Failed to analyze job description'}`);
    } finally {
      setIsAnalyzingJD(false);
    }
  };

  const handleResetJD = () => {
    if (activeJDSessionId) {
      deleteJDSession(activeJDSessionId);
      setActiveJDSessionId(null);
    }
    setJdAnalysis(null);
  };

  return (
    <div className="arpan-bot-window flex flex-col bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden w-[92vw] sm:w-[420px] md:w-[460px] h-[580px] max-h-[85vh] text-white">
      {/* 1. Header */}
      <div className="bg-card border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary">
              <FaRobot size={15} />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-background rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">Arpan Bot</span>
              <span className="text-[10px] bg-primary/20 text-primary font-medium px-1.5 py-0.2 rounded-full border border-primary/30">
                AI 2.0
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Personal Portfolio RAG Assistant</p>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Minimize"
            >
              <FaMinus size={11} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Close"
          >
            <FaTimes size={13} />
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-white/5 text-xs">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 font-medium transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FaCommentDots size={13} /> Chat with Bot
        </button>
        <button
          onClick={() => setActiveTab('jd')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 font-medium transition-all cursor-pointer ${
            activeTab === 'jd'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FaFileAlt size={13} /> JD Match Analyzer
          {jdAnalysis && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* 3. Body Content based on Tab */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        {activeTab === 'chat' ? (
          <div className="p-3 space-y-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 text-gray-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <FaRobot size={11} />
                </div>
                <div className="flex items-center gap-1 bg-card border border-white/10 px-3 py-2 rounded-2xl">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* Tab 2: JD Analyzer */
          <div>
            {!jdAnalysis ? (
              <FileUpload onJDReady={handleJDReady} isProcessing={isAnalyzingJD} />
            ) : (
              <JDAnalysis analysis={jdAnalysis} onReset={handleResetJD} />
            )}
          </div>
        )}
      </div>

      {/* 4. Footer Input (Only active for Chat tab) */}
      {activeTab === 'chat' && (
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      )}
    </div>
  );
}
