'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSessions();
    }
  }, [status]);

  useEffect(() => {
    if (activeSessionId) {
      fetchChatHistory(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions', error);
    }
  };

  const fetchChatHistory = async (id) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${id}`);
      const data = await res.json();
      if (data && data.messages) {
        setMessages(data.messages.map(m => ({
          role: m.role,
          content: m.content
        })));
      }
    } catch (error) {
      console.error('Failed to load chat history', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          sessionId: activeSessionId 
        }),
      });

      const data = await res.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'model', content: data.response }]);
      }
      
      if (!activeSessionId && data.sessionId) {
        setActiveSessionId(data.sessionId);
        fetchSessions(); // Refresh sidebar
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (status === 'unauthenticated') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 font-display">Login Required</h2>
        <p className="text-text-muted mb-6 text-center">You must be logged in to use the AI Symptom Checker.</p>
        <Link href="/login" className="px-6 py-3 bg-accent-green text-white rounded-full font-medium shadow-md">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-primary pt-20">
      {/* Sidebar - History */}
      <div className="w-72 bg-white/40 border-r border-border-card flex flex-col h-full glass">
        <div className="p-4 border-b border-border-card">
          <button 
            onClick={() => setActiveSessionId(null)}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-foreground text-white rounded-xl font-medium hover:bg-opacity-90 transition"
          >
            <span className="text-xl">+</span> New Consultation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-text-muted text-center mt-4">No recent history</p>
          ) : (
            sessions.map(s => (
              <button
                key={s._id}
                onClick={() => setActiveSessionId(s._id)}
                className={`w-full text-left p-3 rounded-xl text-sm truncate transition-colors ${
                  activeSessionId === s._id 
                    ? 'bg-accent-green/15 text-accent-green font-medium border border-accent-green/20' 
                    : 'hover:bg-white/60 text-text-secondary border border-transparent'
                }`}
              >
                💬 {s.title}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat Background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="h-14 border-b border-border-card bg-white/40 backdrop-blur-md flex items-center px-6 z-10 shrink-0">
          <h2 className="font-display font-bold text-lg text-foreground">AI Symptom Checker</h2>
          <div className="ml-4 px-2 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-xs text-accent-green font-medium">
            Beta
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 z-10 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-white/80 border border-border-card rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6">
                🩺
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">How are you feeling today?</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                Describe your symptoms in detail. You can include when they started, their severity, and any other relevant medical context.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['I have a persistent headache and slight fever', 'My throat hurts when I swallow', 'I\'m feeling very tired lately'].map(ex => (
                  <button 
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="px-4 py-2 bg-white/50 border border-border-card rounded-full text-xs text-text-secondary hover:bg-white/80 hover:text-accent-blue hover:border-accent-blue/30 transition"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                      msg.role === 'user' 
                        ? 'bg-foreground text-white rounded-br-sm' 
                        : 'bg-white/70 border border-border-card backdrop-blur-sm text-text-secondary rounded-bl-sm shadow-sm'
                    }`}>
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-5 h-5 rounded-md bg-accent-green/10 flex items-center justify-center text-accent-green text-xs font-bold">A</span>
                          <span className="text-xs font-bold text-foreground">Arogya AI</span>
                        </div>
                      )}
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/5 prose-pre:text-text-primary">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/70 border border-border-card backdrop-blur-sm rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-green rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-bg-primary/80 backdrop-blur-lg border-t border-border-card z-20 shrink-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-end gap-2">
            <div className="flex-1 bg-white/70 border border-border-card rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-accent-green/20 focus-within:border-accent-green transition-all flex">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Describe your symptoms..."
                className="w-full bg-transparent border-none outline-none resize-none max-h-32 min-h-[44px] px-3 py-2 text-sm text-text-primary placeholder-text-muted"
                rows={1}
              />
              <div className="flex items-end pb-1 pr-1">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-accent-green text-white flex items-center justify-center hover:bg-accent-green-light transition-colors disabled:opacity-50 disabled:hover:bg-accent-green"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-text-muted">Arogya AI can make mistakes. Always consult a doctor for medical advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
