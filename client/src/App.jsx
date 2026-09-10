import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, Cpu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import LiveMonitoring from './pages/LiveMonitoring';
import MultimodalAlerts from './pages/MultimodalAlerts';
import CowProfile from './pages/CowProfile';
import AuditCompliance from './pages/AuditCompliance';
import AiCopilot from './pages/AiCopilot';
import FloatingChat from './components/FloatingChat';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-50 premium-grid-overlay">
      {/* ── Mobile Top Header (Visible only on <lg viewports) ────────── */}
      <header className="lg:hidden no-print flex items-center justify-between px-5 h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 shrink-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 -ml-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
        
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-600/10">
            <Cpu className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-xs text-slate-800 tracking-tight leading-none uppercase">
            HerdIntel AI
          </span>
        </div>
        
        <div className="w-8.5 h-8.5" /> {/* Balance spacer to align center */}
      </header>

      {/* ── Navigation Sidebar ────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* ── Main Content Container ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<LiveMonitoring />} />
            <Route path="/alerts" element={<MultimodalAlerts />} />
            <Route path="/cow/:id" element={<CowProfile />} />
            <Route path="/audit" element={<AuditCompliance />} />
            <Route path="/chat" element={<AiCopilot />} />
          </Routes>
        </div>
      </main>

      {/* ── Persistent Floating Chatbot ──────────────────────────────── */}
      <FloatingChat />
    </div>
  );
}
