
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { Message } from '../types';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Yo! I'm Alex. I built this bot to help with travel stuff. Ask me anything! 🤙" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(messages, input);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Server crashed lol. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border-2 border-sky-100 flex flex-col overflow-hidden animate-in zoom-in duration-200">
          <div className="bg-sky-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="font-bold">Alex's Travel Buddy</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-sky-600 w-8 h-8 rounded-full flex items-center justify-center">
               <i className="fas fa-times text-xs"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-sky-500 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm rounded-tl-none border border-slate-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm italic text-slate-400 text-xs">
                  Searching my notes...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-sm focus:border-sky-400 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-sky-500 text-white p-2 rounded-xl hover:bg-sky-600 transition-all flex items-center justify-center"
              >
                <i className="fas fa-paper-plane px-2"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-sky-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all group"
        >
          <i className="fas fa-comment-dots text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
