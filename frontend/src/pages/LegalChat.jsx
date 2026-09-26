import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const LegalChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/legal-chat/history');
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Failed to load chat history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/legal-chat/message', { message: userMessage });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1625] text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-4xl mx-auto w-full">
        <Link to="/dashboard" className="text-sm text-gray-300 hover:text-pink-300 transition">
          ← Back to Dashboard
        </Link>
        <span className="text-lg font-bold">
          Legal <span className="text-pink-300">Assistant</span>
        </span>
        <div className="w-24"></div>
      </nav>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {loadingHistory ? (
            <p className="text-center text-gray-500 text-sm">Loading conversation...</p>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-sm mb-2">👋 Hi, I'm your legal assistant.</p>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Ask me about harassment, workplace rights, or any safety-related legal question.
                I'll guide you with relevant Indian law references.
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-[#26215C] rounded-br-sm'
                      : 'bg-[#241f36] border border-[#352f4a] text-gray-200 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#241f36] border border-[#352f4a] text-gray-400 px-4 py-3 rounded-2xl rounded-bl-sm text-sm">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="py-6 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a legal question..."
            className="flex-1 px-4 py-3 bg-[#241f36] border border-[#352f4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-300 to-pink-300 text-[#26215C] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default LegalChat;