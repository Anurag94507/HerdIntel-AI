import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  ChevronDown,
  Volume2,
  Square,
  Brain,
  Settings,
  Loader2,
  Zap,
  Tag
} from 'lucide-react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'f-init',
      sender: 'ai',
      text: "👋 **Hi! I'm Barny, the Barn Assistant.**\n\nI can help you audit cattle records or translate notes. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [language, setLanguage] = useState(() => localStorage.getItem('chat_language') || 'Hinglish');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const speakText = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingVoice === id) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*|__/g, '').replace(/[*_`#]/g, '');
    const utt = new SpeechSynthesisUtterance(cleanText);
    const pref = language === 'English' ? 'en' : 'hi';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(pref) && v.name.includes('Google')) ||
                  voices.find(v => v.lang.startsWith(pref)) ||
                  voices[0];
    if (voice) utt.voice = voice;
    utt.onstart = () => setIsPlayingVoice(id);
    utt.onend = () => setIsPlayingVoice(null);
    utt.onerror = () => setIsPlayingVoice(null);
    window.speechSynthesis.speak(utt);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlayingVoice(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageText = input.trim();
    if (!messageText) return;

    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: messageText }]);
    setInput('');
    setIsLoading(true);
    stopSpeech();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-gemini-key': apiKey },
        body: JSON.stringify({ message: messageText, language })
      });
      if (!res.ok) throw new Error('API failure');
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        calculation: data.calculation
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ **System Offline:** Failed to reach AI copilot pipeline. Verify connection.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderText = (text) => text.split('\n').map((line, i) => {
    const isBullet = line.trim().startsWith('* ');
    const displayLine = isBullet ? line.trim().substring(2) : line;
    const formatted = displayLine
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 text-[10px]">$1</code>');

    if (isBullet) {
      return (
        <li key={i} className="ml-4 list-disc text-xs leading-relaxed mb-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
    return (
      <p key={i} className="text-xs leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });

  return (
    <div className="no-print fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Window drawer ─────────────────────────────────────── */}
      <div
        className={`
          w-80 sm:w-96 h-[480px] bg-white border border-slate-200/80 rounded-2xl shadow-2xl flex flex-col mb-4
          transition-all duration-300 transform origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="px-4.5 py-3.5 bg-slate-50 border-b border-slate-200/60 rounded-t-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
                Barny the Assistant
              </h3>
              <p className="text-[8px] text-slate-400 font-mono tracking-wider uppercase">Online RAG Node</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Language */}
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 text-[9px] text-slate-500 font-mono outline-none"
            >
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">हिंदी</option>
              <option value="English">English</option>
            </select>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg border transition-all ${showSettings ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'}`}
              title="Config key"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleChat}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* API Key Panel */}
        {showSettings && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-col gap-1.5 shrink-0">
            <label className="text-[8.5px] font-bold text-slate-450 font-mono uppercase tracking-wider">Gemini API Key Override</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value); }}
              placeholder="Paste Gemini API key..."
              className="premium-input py-1.5 w-full bg-white text-xs border border-slate-350"
            />
            <p className="text-[9px] text-slate-400 font-mono mt-1 font-bold">Leave blank to fallback to simulator.</p>
          </div>
        )}

        {/* Messages Dialog Flow */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                {/* Bubble */}
                <div className={`p-3 rounded-xl relative ${
                  isUser
                    ? 'bg-slate-105 text-slate-800 rounded-br-none border border-slate-200/60'
                    : 'bg-emerald-50/50 text-emerald-950 rounded-bl-none border border-emerald-100/50'
                }`}>
                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      className={`absolute top-2 right-2 p-1 rounded-lg transition-all ${isPlayingVoice === msg.id ? 'bg-red-50 text-red-650' : 'text-slate-405 hover:text-slate-600'}`}
                    >
                      {isPlayingVoice === msg.id ? <Square className="w-2.5 h-2.5 fill-current" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  )}
                  <div className="chat-message-markdown pr-4">{renderText(msg.text)}</div>

                  {/* Solved formula container */}
                  {msg.calculation && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[9px] space-y-1">
                      <div className="text-emerald-700 font-bold uppercase text-[8px] tracking-wider">Calculation Registry</div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-400">Expr:</span>
                        <span className="text-slate-750 truncate font-semibold">{msg.calculation.expression}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/50 pt-1.5 font-bold">
                        <span className="text-slate-500">Output:</span>
                        <span className="text-emerald-650">{msg.calculation.result}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center gap-1.5 mr-auto p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-400 font-mono w-24">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.3s]" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Panel Form */}
        <form onSubmit={sendMessage} className="p-3 bg-slate-55 border-t border-slate-200 flex gap-2 items-center shrink-0">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isLoading ? 'Inference active...' : 'Speak or type to Barny...'}
            className="premium-input py-2 flex-1 text-xs"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="premium-btn-primary p-2 rounded-xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ── Bouncing Launcher Bubble Button ─────────────────────────── */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        title="Quick Chat"
      >
        {isOpen ? <ChevronDown className="w-6 h-6 animate-fade-in" /> : <MessageSquare className="w-5.5 h-5.5 animate-fade-in" />}
      </button>
    </div>
  );
}
