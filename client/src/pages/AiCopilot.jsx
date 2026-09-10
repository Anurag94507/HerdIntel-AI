import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Mic, MicOff, Camera, Volume2, Sparkles,
  RefreshCw, X, Brain, Zap,
  CheckCircle, Square, Globe, Settings, Key,
  Cpu, Wifi, Eye, BarChart2, Clock, Upload, Terminal, ChevronDown, ChevronUp
} from 'lucide-react';

/* ── Preset SVG Graphics ──────────────────────────────────────────── */
const UdderThermalGraphic = () => (
  <svg className="w-full h-full bg-slate-50/70 rounded-xl border border-red-200/50" viewBox="0 0 200 120">
    <defs>
      <radialGradient id="thermalHotspot" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#dc2626" stopOpacity="0.9" />
        <stop offset="50%"  stopColor="#f97316" stopOpacity="0.6" />
        <stop offset="80%"  stopColor="#eab308" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="thermalCool" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#0891b2" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
    </defs>
    <path d="M 20 60 Q 50 30, 90 40 T 150 45 Q 180 50, 190 70 Q 170 85, 150 80 Q 130 95, 110 95 T 80 90 T 50 80 Q 30 85, 20 60 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
    <circle cx="115" cy="85" r="22" fill="url(#thermalCool)" />
    <circle cx="125" cy="82" r="12" fill="url(#thermalHotspot)" />
    <line x1="125" y1="65" x2="125" y2="99" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="2" />
    <line x1="108" y1="82" x2="142" y2="82" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="2" />
    <circle cx="125" cy="82" r="6" fill="none" stroke="#dc2626" strokeWidth="0.75" />
    <text x="135" y="75" fill="#dc2626" fontSize="6" fontWeight="bold" fontFamily="monospace">HOTSPOT: +2.8°C</text>
    <text x="135" y="83" fill="#dc2626" fontSize="5" fontFamily="monospace">FL-QUARTER</text>
    <text x="10"  y="15" fill="#64748b" fontSize="6" fontFamily="monospace">MODE: THERMAL IR SENSOR</text>
  </svg>
);

const GaitSkeletalGraphic = () => (
  <svg className="w-full h-full bg-slate-50/70 rounded-xl border border-cyan-200/50" viewBox="0 0 200 120">
    <path d="M 30 70 L 60 50 L 120 50 L 150 65 L 170 55 L 175 60 L 155 80 L 120 85 L 70 85 Z" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2" />
    <path d="M 40 68 L 70 52 L 100 50 L 130 54 Q 140 56, 150 64" fill="none" stroke="#0891b2" strokeWidth="1.5" />
    <path d="M 125 53 L 132 72 L 130 92 L 122 105" fill="none" stroke="#2563eb" strokeWidth="1.5" />
    <path d="M 135 55 L 146 75 L 152 90 L 150 102" fill="none" stroke="#dc2626" strokeWidth="1.5" />
    <path d="M 60 55 L 56 75 L 58 92 L 62 105" fill="none" stroke="#0891b2" strokeWidth="1.5" />
    <path d="M 68 53 L 70 73 L 68 91 L 70 103" fill="none" stroke="#0891b2" strokeWidth="1.5" />
    <circle cx="40"  cy="68"  r="3"   fill="#7e22ce" />
    <circle cx="70"  cy="52"  r="3"   fill="#0891b2" />
    <circle cx="100" cy="50"  r="3"   fill="#0891b2" />
    <circle cx="135" cy="55"  r="3.5" fill="#dc2626" />
    <circle cx="146" cy="75"  r="3"   fill="#dc2626" />
    <circle cx="152" cy="90"  r="3"   fill="#dc2626" />
    <circle cx="150" cy="102" r="3"   fill="#dc2626" />
    <circle cx="125" cy="53"  r="3"   fill="#2563eb" />
    <circle cx="132" cy="72"  r="3"   fill="#2563eb" />
    <circle cx="130" cy="92"  r="3"   fill="#2563eb" />
    <circle cx="122" cy="105" r="3"   fill="#2563eb" />
    <path d="M 125 50 A 25 25 0 0 1 145 60" fill="none" stroke="#dc2626" strokeWidth="1" />
    <text x="148" y="48"  fill="#dc2626" fontSize="6" fontWeight="bold" fontFamily="monospace">148° DEV</text>
    <text x="120" y="115" fill="#dc2626" fontSize="5"             fontFamily="monospace">REAR LEFT HIND LAG (12%)</text>
    <text x="10"  y="15"  fill="#64748b" fontSize="6"             fontFamily="monospace">MODE: OPTICAL GAIT MATRIX</text>
  </svg>
);

const PastureNdviGraphic = () => (
  <svg className="w-full h-full bg-slate-50/70 rounded-xl border border-emerald-200/50" viewBox="0 0 200 120">
    <defs>
      <linearGradient id="ndviGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#059669" stopOpacity="0.8" />
        <stop offset="40%"  stopColor="#10b981" stopOpacity="0.6" />
        <stop offset="70%"  stopColor="#eab308" stopOpacity="0.5" />
        <stop offset="90%"  stopColor="#ea580c" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="180" height="100" fill="url(#ndviGrad)" rx="8" />
    <path d="M 20 40 C 40 30, 80 50, 110 30 C 140 10, 160 50, 180 40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
    <path d="M 15 70 C 50 60, 90 85, 120 70 C 150 55, 170 95, 185 80" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
    <line x1="70" y1="10" x2="70" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="130" y1="10" x2="130" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <circle cx="155" cy="85" r="18" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3" />
    <text x="130" y="62" fill="#dc2626" fontSize="6" fontWeight="bold" fontFamily="monospace">DEPLETED BIOMASS</text>
    <text x="130" y="69" fill="#dc2626" fontSize="5"             fontFamily="monospace">NDVI: 0.44 (LOW)</text>
    <text x="15"  y="22" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="monospace">SECTOR NE-4 DEPLETION</text>
    <text x="15"  y="102" fill="#f8fafc" fontSize="5"            fontFamily="monospace">NDVI SPECTROMETRY FEED • 20m ALTITUDE</text>
  </svg>
);

const EarTagGraphic = () => (
  <svg className="w-full h-full bg-slate-50/70 rounded-xl border border-purple-200/50" viewBox="0 0 200 120">
    <path d="M 20 40 C 40 20, 80 30, 110 50 C 140 70, 160 85, 180 90 C 150 90, 110 80, 80 70 C 50 60, 30 60, 20 40 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
    <g transform="translate(100, 52) rotate(15)">
      <rect x="0" y="0" width="35" height="25" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <circle cx="17" cy="4" r="1.5" fill="#475569" />
      <text x="17" y="18" fill="#000" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">104</text>
    </g>
    <path d="M 85 40 L 75 40 L 75 55"   fill="none" stroke="#7e22ce" strokeWidth="1.5" />
    <path d="M 155 40 L 165 40 L 165 55" fill="none" stroke="#7e22ce" strokeWidth="1.5" />
    <path d="M 85 92 L 75 92 L 75 77"   fill="none" stroke="#7e22ce" strokeWidth="1.5" />
    <path d="M 155 92 L 165 92 L 165 77" fill="none" stroke="#7e22ce" strokeWidth="1.5" />
    <text x="80" y="32"  fill="#7e22ce" fontSize="7" fontWeight="bold" fontFamily="monospace">OCR LOCK ON: TAG_104</text>
    <text x="80" y="105" fill="#7e22ce" fontSize="6"             fontFamily="monospace">MATCH CONFIDENCE: 99.8%</text>
    <text x="10" y="15"  fill="#64748b" fontSize="6"             fontFamily="monospace">MODE: OPTICAL OCR RECOGNITION</text>
  </svg>
);

export default function AiCopilot() {
  const [messages, setMessages] = useState([
    {
      id: 'init-1', sender: 'ai',
      text: "🐄 **Namaste! Welcome to HerdIntel AI Copilot, Farmer.**\n\nI'm your agricultural assistant. Feel free to speak or type in Hindi, Hinglish, Bhojpuri, Awadhi, or English.\n\n* **Image Diet Planner:** Upload a photo of your cow, and I'll generate a regional feeding plan (हरे चारे, दाने और खनिज का संतुलित हिसाब).\n* **Voice Enabled:** Tap the mic to record. I'll read my responses back to you.\n* **Ledger Accounts:** Ask me to log sales or expense amounts (जैसे *\"दूध बिक्री 1500\"* या *\"spent 500 on feed\"*).",
      telemetry: { modelName: 'Gemini 3.5 Flash', latencyMs: 95, tokensSec: 82.5, confidence: 99.9, gpuLoad: 12, inferenceContext: 'Cold Start • System Idle' }
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [language, setLanguage]       = useState(() => localStorage.getItem('chat_language') || 'Hinglish');
  const [apiKey, setApiKey]           = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [showLogsMobile, setShowLogsMobile] = useState(false); // Mobile toggle state for logs panel

  const [isListening, setIsListening]   = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showWebcam, setShowWebcam]     = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning]     = useState(false);

  const [telemetry, setTelemetry] = useState({
    modelName: 'Gemini 3.5 Flash', latencyMs: 95, tokensSec: 82.5,
    confidence: 99.9, gpuLoad: 12, inferenceContext: 'Cold Start • System Idle'
  });

  const [systemLogs, setSystemLogs] = useState([
    'System initialization... Weights calibrated.',
    'SQLite connection active (cownet.db synchronized).',
    'Vision Transformer channel parameters loaded.',
    'Speech synthesizers online. Dictionary parsed.',
    'Acoustic filters operational.',
  ]);

  const recentCalcMsg      = [...messages].reverse().find(m => m.calculation);
  const currentCalculation = recentCalcMsg ? recentCalcMsg.calculation : null;

  const chatEndRef       = useRef(null);
  const videoRef         = useRef(null);
  const canvasRef        = useRef(null);
  const recognitionRef   = useRef(null);
  const cameraStreamRef  = useRef(null);

  // Auto-scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading, isScanning]);

  // Live log ticks
  useEffect(() => {
    const traces = [
      'Recalculating telemetry sensor thresholds for herd weights...',
      'Inference model active: top_p 0.95, temperature 0.3...',
      'Database queried: 4 rows loaded for Cow #104...',
      'Acoustic volume envelope calibrated.',
      'ViT model transforming channels to tensor [3, 224, 224]...',
      'Respiratory cough patterns logged vs herd baseline (+4.2%).',
      'Neural LSTM layer initialized for behavioral prediction...',
      'System temperature stabilized. GPU active.',
    ];
    const interval = setInterval(() => {
      const trace = traces[Math.floor(Math.random() * traces.length)];
      setSystemLogs(prev => {
        const next = [...prev, `[${new Date().toLocaleTimeString()}] ${trace}`];
        if (next.length > 25) next.shift();
        return next;
      });
      setTelemetry(prev => ({ ...prev, gpuLoad: Math.max(15, Math.min(85, prev.gpuLoad + (Math.random() > 0.5 ? 4 : -4))) }));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Speech recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false;
    rec.lang = language === 'English' ? 'en-US' : 'hi-IN';
    rec.onstart  = () => { setIsListening(true);  addLog('[STT] Speech capture started...'); };
    rec.onresult = (e) => { const t = e.results[0][0].transcript; setInput(p => p ? p + ' ' + t : t); addLog(`[STT] Audio decoded: "${t}"`); };
    rec.onerror  = (e) => { setIsListening(false); addLog(`[STT] Calibration error: ${e.error}`); };
    rec.onend    = () => { setIsListening(false);  addLog('[STT] Speech capture release.'); };
    recognitionRef.current = rec;
  }, [language]);

  useEffect(() => { localStorage.setItem('chat_language', language); }, [language]);

  const addLog = (msg) => setSystemLogs(p => { const n = [...p, msg]; if (n.length > 25) n.shift(); return n; });

  const toggleListening = () => {
    if (!recognitionRef.current) { alert('Speech recognition not supported. Use Chrome or Edge.'); return; }
    if (isListening) recognitionRef.current.stop(); else { stopSpeech(); recognitionRef.current.start(); }
  };

  const speakText = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingVoice === id) { stopSpeech(); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*|__|[*_]/g, '').replace(/###/g, 'Section:').replace(/`([^`]+)`/g, m => m.replace(/`/g, ''));
    const utt = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    const pref = language === 'English' ? 'en' : 'hi';
    const voice = voices.find(v => v.lang.startsWith(pref) && v.name.includes('Google')) || voices.find(v => v.lang.startsWith(pref)) || voices[0];
    if (voice) utt.voice = voice;
    utt.onstart = () => setIsPlayingVoice(id);
    utt.onend   = () => setIsPlayingVoice(null);
    utt.onerror = () => setIsPlayingVoice(null);
    window.speechSynthesis.speak(utt);
  };

  const stopSpeech = () => { window.speechSynthesis.cancel(); setIsPlayingVoice(null); };

  const startCamera = async () => {
    setSelectedPreset(null); setCapturedImage(null); setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 640, height: 480 } });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      cameraStreamRef.current = stream;
      addLog('[Webcam] Live video connection active.');
    } catch {
      alert('Camera access denied.'); setShowWebcam(false);
    }
  };

  const closeCamera = () => {
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    cameraStreamRef.current = null; setShowWebcam(false);
    addLog('[Webcam] Release camera streams.');
  };

  const captureFrame = () => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      closeCamera(); addLog('[Webcam] Static frame captured.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setSelectedPreset(null);
        addLog(`[Upload] Staged cow photo: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const messageText = input.trim();
    if (!messageText && !selectedPreset && !capturedImage) return;
    const userText = messageText || `[Cow diet query with photo]`;
    setMessages(prev => [...prev, { id: 'msg-' + Date.now(), sender: 'user', text: userText, image: selectedPreset || capturedImage }]);
    setInput(''); setIsLoading(true);

    if (selectedPreset || capturedImage) {
      setIsScanning(true); addLog(`[Vision] Analyzing image payload parameters...`);
      await new Promise(r => setTimeout(r, 1200));
      setIsScanning(false);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-gemini-key': apiKey },
        body: JSON.stringify({ message: messageText, imagePreset: selectedPreset, customImage: capturedImage, language })
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setSelectedPreset(null); setCapturedImage(null);
      setTelemetry(data.telemetry);
      addLog(`[LLM] Response fetched. Certainty score: ${data.telemetry.confidence}%.`);
      setMessages(prev => [...prev, { id: 'ai-' + Date.now(), sender: 'ai', text: data.reply, analysis: data.analysis, telemetry: data.telemetry, calculation: data.calculation }]);
    } catch {
      setMessages(prev => [...prev, { id: 'err-' + Date.now(), sender: 'ai', text: '🚨 **Network Failure:** Connection to the model pipeline failed. Ensure the server is online.', telemetry: { modelName: 'Error', latencyMs: 0, tokensSec: 0, confidence: 0, gpuLoad: 0, inferenceContext: 'Pipeline offline' } }]);
    } finally { setIsLoading(false); }
  };

  const selectPreset = (type) => {
    setSelectedPreset(type); setCapturedImage(null);
    setInput(p => p || `Run diagnostic scan for preset ${type}`);
    addLog(`[Preset] Loaded diagnostic scan logic for ${type}.`);
  };

  const checkCow = (tag) => { setInput(`show telemetry status for cow #${tag}`); };

  const renderGraphic = (preset) => {
    const wrapCls = 'w-full h-36 mt-3 rounded-xl overflow-hidden shadow-sm';
    if (preset === 'udder')   return <div className={wrapCls}><UdderThermalGraphic /></div>;
    if (preset === 'gait')    return <div className={wrapCls}><GaitSkeletalGraphic /></div>;
    if (preset === 'pasture') return <div className={wrapCls}><PastureNdviGraphic /></div>;
    if (preset === 'tag')     return <div className={wrapCls}><EarTagGraphic /></div>;
    if (preset?.startsWith('data:image')) return (
      <div className={`${wrapCls} border border-slate-200/60 bg-slate-50`}>
        <img src={preset} className="w-full h-full object-contain" alt="Uploaded Cow" />
      </div>
    );
    return null;
  };

  const renderText = (text) => text.split('\n').map((line, i) => {
    const isBullet = line.startsWith('* ');
    const isHeading = line.startsWith('### ');
    const content = isBullet ? line.substring(2) : isHeading ? line.substring(4) : line;

    const c = content
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g,     '<em>$1</em>')
      .replace(/`([^`]+)`/g,       '<code class="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200">$1</code>');

    if (isBullet) {
      return <li key={i} className="ml-4 list-disc text-xs text-slate-655 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: c }} />;
    }
    if (isHeading) {
      return <h4 key={i} className="text-xs font-bold text-emerald-750 uppercase tracking-wider mt-3 mb-1.5 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-600" /><span dangerouslySetInnerHTML={{ __html: c }} /></h4>;
    }
    return <p key={i} className="text-xs text-slate-600 mb-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: c }} />;
  });

  const confColor = telemetry.confidence >= 90 ? '#059669' : telemetry.confidence >= 70 ? '#d97706' : '#dc2626';

  return (
    <div className="max-w-7xl mx-auto w-full min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-4rem)] flex flex-col relative z-10 py-1">
      
      {/* ── Outer Shell Grid ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: MAIN CO-PILOT CHAT INTERFACE (Takes 2 cols on desktop) */}
        <div className="lg:col-span-2 flex flex-col premium-card shadow-sm overflow-hidden bg-white border border-slate-200">
          
          {/* Header */}
          <div className="panel-header shrink-0 flex items-center justify-between bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2 font-mono uppercase tracking-wider">
                  HerdIntel AI Copilot
                  <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Inference</span>
                </h2>
                <p className="text-[9px] text-slate-400 font-mono tracking-wider">SECURE KNOWLEDGE NETWORK</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2.5 py-1 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-emerald-650" />
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="bg-transparent text-[10px] text-slate-650 font-mono border-none outline-none cursor-pointer"
                >
                  <option value="Hinglish">Hinglish</option>
                  <option value="Hindi">हिंदी</option>
                  <option value="Bhojpuri">भोजपुरी</option>
                  <option value="Awadhi">अवधी</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettings(s => !s)}
                className={`p-1.5 rounded-lg border transition-all ${showSettings ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
                title="API Config"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Toggle Logs for Mobile */}
              <button
                onClick={() => setShowLogsMobile(!showLogsMobile)}
                className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 transition-colors"
                title="Toggle System Console Logs"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inline Telemetry Bar */}
          <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[9px] font-mono text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>Model: <strong className="text-slate-800 font-bold">{telemetry.modelName}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Latency: <strong className="text-slate-800 font-bold">{telemetry.latencyMs}ms</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Throughput: <strong className="text-slate-800 font-bold">{telemetry.tokensSec} t/s</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: confColor }} />
              <span>Confidence: <strong className="text-slate-800 font-bold" style={{ color: confColor }}>{telemetry.confidence}%</strong></span>
            </div>
          </div>

          {/* Settings Drawer Overlay */}
          {showSettings && (
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-slide-up">
              <div className="flex items-center gap-2 shrink-0">
                <Key className="w-3.5 h-3.5 text-emerald-655" />
                <span className="text-[9px] font-bold text-slate-650 font-mono uppercase tracking-wider">Gemini API Key</span>
              </div>
              <div className="flex-1 flex gap-2 w-full">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => { setApiKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value); }}
                  placeholder="Paste Gemini cloud session API key..."
                  className="premium-input py-1.5 w-full bg-white text-xs border border-slate-350 focus:border-emerald-650 font-mono"
                />
              </div>
            </div>
          )}

          {/* Chat dialog logs */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[50vh] lg:max-h-[60vh] bg-white">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[90%] lg:max-w-[85%] animate-fade-in-up ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                     style={{ animationDelay: `${idx * 0.02}s` }}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs border select-none ${
                    isUser ? 'bg-slate-105 border-slate-200 text-slate-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold'
                  }`}>
                    {isUser ? '👨‍🌾' : '🤖'}
                  </div>

                  {/* Bubble */}
                  <div className={`p-3.5 relative ${isUser ? 'msg-user' : 'msg-ai'}`} style={{ maxWidth: '100%' }}>
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`absolute top-2.5 right-2.5 p-1 rounded-lg transition-all ${isPlayingVoice === msg.id ? 'bg-red-50 text-red-650' : 'bg-slate-50 text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200'}`}
                        title="Read text"
                      >
                        {isPlayingVoice === msg.id ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <div className="chat-message-markdown pr-5">{renderText(msg.text)}</div>
                    {msg.image && renderGraphic(msg.image)}

                    {/* AI calculation formula box */}
                    {msg.calculation && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[9px] space-y-1.5">
                        <div className="text-emerald-700 font-bold uppercase text-[8px] tracking-wider">📊 Mathematical solver</div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-400">Formula expression:</span>
                          <span className="text-slate-700 font-bold truncate">{msg.calculation.expression}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200/50 pt-1.5 font-bold text-slate-800">
                          <span className="text-slate-550">Solved output:</span>
                          <span className="text-emerald-650 font-extrabold">{msg.calculation.result}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isScanning && (
              <div className="flex gap-3 max-w-[75%] mr-auto animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-650">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="msg-ai p-4 relative overflow-hidden w-72">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-750 font-bold uppercase">Evaluating cow image feed...</span>
                  </div>
                  <div className="h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200/60">
                    <RefreshCw className="w-5 h-5 text-emerald-600/40 animate-spin" />
                  </div>
                </div>
              </div>
            )}

            {isLoading && !isScanning && (
              <div className="flex gap-3 max-w-[55%] mr-auto animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-emerald-600 animate-spin" />
                </div>
                <div className="msg-ai p-4 flex items-center gap-2 bg-white border border-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-650 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-650 animate-bounce [animation-delay:0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-655 animate-bounce [animation-delay:0.3s]" />
                  <span className="text-[10px] text-slate-400 font-mono ml-2 uppercase">Syncing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Webcam diagnostic scan view */}
          {showWebcam && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 relative shrink-0">
              <button onClick={closeCamera} className="absolute top-3 right-3 p-1.5 bg-white hover:bg-slate-100 rounded-lg text-slate-450 border border-slate-200 z-10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
              <h4 className="text-[9px] font-bold text-emerald-700 font-mono tracking-widest mb-3 flex items-center gap-1.5 uppercase">
                <Camera className="w-4 h-4" /> Optical Telemetry Scanner Feed
              </h4>
              <div className="relative w-full max-w-sm mx-auto aspect-video rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              </div>
              <div className="flex justify-center mt-3">
                <button onClick={captureFrame} className="flex items-center gap-2 px-4.5 py-2 bg-emerald-50 border border-emerald-150 text-emerald-700 text-[10px] font-bold font-mono rounded-xl hover:bg-emerald-100 transition-all cursor-pointer uppercase">
                  <Camera className="w-3.5 h-3.5" /> Capture Frame
                </button>
              </div>
            </div>
          )}

          {/* Uploaded files thumbnail preview */}
          {(selectedPreset || capturedImage) && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-14 h-9 border border-slate-200 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm">
                  {selectedPreset === 'udder'   && <UdderThermalGraphic />}
                  {selectedPreset === 'gait'    && <GaitSkeletalGraphic />}
                  {selectedPreset === 'pasture' && <PastureNdviGraphic />}
                  {selectedPreset === 'tag'     && <EarTagGraphic />}
                  {capturedImage && <img src={capturedImage} className="w-full h-full object-contain bg-slate-50" alt="Staged Cow Photo" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-700 font-mono uppercase">{selectedPreset ? `${selectedPreset} Scan` : 'Staged Cow Photo'}</p>
                  <p className="text-[9px] text-emerald-600 font-mono uppercase tracking-wider font-extrabold">Staged for Diet Assessment</p>
                </div>
              </div>
              <button onClick={() => { setSelectedPreset(null); setCapturedImage(null); }} className="p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg border border-slate-200 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input form & presets container */}
          <form onSubmit={sendMessage} className="p-4 bg-slate-50/50 border-t border-slate-200 space-y-4 shrink-0">
            {/* Presets Row 1: Diagnostics */}
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="text-[9px] text-slate-400 font-mono tracking-wider font-bold uppercase shrink-0">Scan Presets:</span>
              {[
                { key: 'udder',   label: '🌡 Udder Thermal',  cls: 'active-red'    },
                { key: 'gait',    label: '🦿 Gait Skeletal',  cls: 'active-cyan'   },
                { key: 'pasture', label: '🛰 Pasture NDVI',   cls: 'active-green'  },
                { key: 'tag',     label: '🏷 Ear Tag OCR',    cls: 'active-purple' },
              ].map(p => (
                <button key={p.key} type="button" onClick={() => selectPreset(p.key)}
                  className={`preset-chip shrink-0 ${selectedPreset === p.key ? p.cls : ''}`}>
                  {p.label}
                </button>
              ))}
              <span className="text-[9px] text-slate-455 font-mono tracking-wider font-bold uppercase shrink-0 ml-4">Cows:</span>
              {['101','104'].map(tag => (
                <button key={tag} type="button" onClick={() => checkCow(tag)} className="preset-chip shrink-0">#{tag}</button>
              ))}
            </div>

            {/* Presets Row 2: Bookkeeping */}
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 border-t border-slate-100 pt-2.5">
              <span className="text-[9px] text-emerald-600 font-mono tracking-wider font-bold uppercase shrink-0">Bookkeeping:</span>
              {[
                { text: 'I am worried about feed costs', label: '😟 Worried' },
                { text: 'calculate my net profit / show hisab', label: '📊 Ledger Report' },
                { text: 'log sale 5000 for Holstein milk', label: '📈 Log Sale' },
                { text: 'log expense 1800 for cattle feed', label: '📉 Log Expense' },
              ].map((fc, i) => (
                <button key={i} type="button" onClick={() => setInput(fc.text)} className="preset-chip shrink-0">{fc.label}</button>
              ))}
            </div>

            {/* Main typing panel controls */}
            <div className="flex gap-2.5 items-center border-t border-slate-105 pt-3">
              <button type="button" onClick={startCamera}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-emerald-605 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer shadow-sm"
                title="Camera">
                <Camera className="w-4 h-4" />
              </button>
              
              <label className="p-2.5 bg-white border border-slate-205 rounded-xl text-emerald-600 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer shadow-sm" title="Upload Photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-4 h-4" />
              </label>

              <button type="button" onClick={toggleListening}
                className={`p-2.5 border rounded-xl transition-all shrink-0 cursor-pointer shadow-sm ${
                  isListening
                    ? 'bg-red-50 border-red-300 text-red-650 animate-pulse'
                    : 'bg-white border-slate-200 text-emerald-650 hover:bg-slate-50'
                }`}
                title="Voice Input">
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isListening ? 'Transcribing audio feed...' : 'Ask AI Copilot or upload photo for diet plan...'}
                  className="premium-input w-full pr-12"
                  disabled={isLoading}
                />
                
                {isListening && (
                  <div className="absolute right-3.5 flex items-end gap-0.5 h-3 select-none">
                    <span className="w-[1.5px] bg-red-400 audio-bar-1" />
                    <span className="w-[1.5px] bg-red-400 audio-bar-2" />
                    <span className="w-[1.5px] bg-red-400 audio-bar-3" />
                    <span className="w-[1.5px] bg-red-400 audio-bar-4" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedPreset && !capturedImage)}
                className="premium-btn-primary p-2.5 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* RIGHT COLUMN: SYSTEM TELEMETRY & CONSOLE LOGS (Collapsible on mobile) */}
        <div className={`
          lg:col-span-1 flex flex-col premium-card shadow-sm overflow-hidden bg-slate-905 text-slate-100 border border-slate-800
          ${showLogsMobile ? 'flex' : 'hidden lg:flex'}
        `}>
          {/* Header */}
          <div className="panel-header bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 py-3.5 px-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Terminal className="w-4 h-4" />
              <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest">AI Server Telemetry</h3>
            </div>
            <span className="text-[8.5px] font-bold text-cyan-405 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-850/50 uppercase tracking-widest font-mono">
              Simulator Online
            </span>
          </div>

          {/* Diagnostics Meters */}
          <div className="p-4 bg-slate-950/40 border-b border-slate-850 space-y-3.5 shrink-0">
            <div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1.5">
                <span>GPU METRIC ENGINE LOAD</span>
                <span className="text-slate-200 font-bold">{telemetry.gpuLoad}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${telemetry.gpuLoad}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[9.5px] font-mono text-slate-400">
              <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-850">
                <span className="block text-[8px] text-slate-500 mb-0.5 uppercase font-bold">Certainty Index</span>
                <span className="text-emerald-400 font-extrabold">{telemetry.confidence}%</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-850">
                <span className="block text-[8px] text-slate-500 mb-0.5 uppercase font-bold">Model Sync Latency</span>
                <span className="text-cyan-400 font-extrabold">{telemetry.latencyMs}ms</span>
              </div>
            </div>
          </div>

          {/* Console Text Logs */}
          <div className="flex-1 p-4 font-mono text-[9px] text-slate-300 overflow-y-auto space-y-1.5 bg-slate-950/20 select-text">
            {systemLogs.map((log, i) => (
              <div key={i} className="leading-relaxed whitespace-pre-wrap select-text selection:bg-slate-700 selection:text-white">
                <span className="text-slate-550 font-bold">&gt;</span> {log}
              </div>
            ))}
            <div />
          </div>

          {/* Calculations Receipt Indicator */}
          {currentCalculation && (
            <div className="p-4 bg-slate-950 border-t border-slate-850 font-mono text-[9px] space-y-2 shrink-0 animate-fade-in-up">
              <div className="flex items-center gap-1.5 text-emerald-450 uppercase font-bold text-[8.5px]">
                <Zap className="w-3.5 h-3.5" /> Arithmetic Registry Sync
              </div>
              <div className="flex justify-between gap-3 text-slate-400">
                <span>Expression:</span>
                <span className="text-slate-200 truncate">{currentCalculation.expression}</span>
              </div>
              <div className="flex justify-between border-t border-slate-850 pt-1.5 font-bold">
                <span className="text-slate-450">Result:</span>
                <span className="text-emerald-650 font-extrabold">{currentCalculation.result}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
