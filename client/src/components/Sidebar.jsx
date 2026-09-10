import { NavLink } from 'react-router-dom';
import {
  Activity,
  ShieldAlert,
  FileCheck,
  Cpu,
  Sparkles,
  ChevronRight,
  X,
  ChevronLeft
} from 'lucide-react';

const navItems = [
  { to: '/',       label: 'Live Monitoring',    icon: Activity,    id: 'nav-monitoring' },
  { to: '/alerts', label: 'Multimodal Alerts',  icon: ShieldAlert, id: 'nav-alerts' },
  { to: '/audit',  label: 'Audit & Compliance', icon: FileCheck,   id: 'nav-audit' },
  { to: '/chat',   label: 'AI Copilot',         icon: Sparkles,    id: 'nav-chat' },
];

export default function Sidebar({ isOpen, onClose, isCollapsed, setIsCollapsed }) {
  return (
    <>
      {/* ── Mobile Drawer Backdrop Overlay ────────────────────────────── */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* ── Sidebar Container ────────────────────────────────────────── */}
      <aside
        className={`
          no-print fixed inset-y-0 left-0 lg:static z-50 flex flex-col h-screen
          bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header Section */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between h-20 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            {(!isCollapsed || isOpen) && (
              <div className="animate-fade-in truncate">
                <h1 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none uppercase">
                  HerdIntel AI
                </h1>
                <span className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase mt-1.5 block font-mono">
                  Farmer Portal
                </span>
              </div>
            )}
          </div>

          {/* Close button for Mobile drawer */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, id }) => (
            <NavLink
              key={to}
              to={to}
              id={id}
              onClick={() => {
                if (isOpen && onClose) onClose();
              }}
              className={({ isActive }) => `
                group flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider
                transition-all duration-200 border border-transparent
                ${isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/20 font-extrabold shadow-sm shadow-emerald-600/5'
                  : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-50'
                }
              `}
              title={isCollapsed ? label : ''}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {(!isCollapsed || isOpen) && (
                <>
                  <span className="flex-1 font-sans truncate text-[11px]">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Connection pipeline / mini banner status */}
        {(!isCollapsed || isOpen) ? (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-[9px] font-bold font-sans uppercase text-slate-550 tracking-wider">
                Telemetry Link
              </div>
              <span className="text-[10px] font-bold text-emerald-600 font-mono uppercase tracking-widest flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                CONNECTED
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
          </div>
        )}

        {/* Collapsible toggle action button for Desktop */}
        <div className="hidden lg:flex p-3 border-t border-slate-100 shrink-0 justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg border border-slate-200 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
}
