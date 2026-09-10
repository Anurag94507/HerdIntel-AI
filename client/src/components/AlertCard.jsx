import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Clock,
  ChevronRight,
  Zap,
  CheckCircle2,
  Tag
} from 'lucide-react';

const riskConfig = {
  High: {
    icon: ShieldAlert,
    badge: 'badge-danger',
    border: 'border-red-200/60 hover:border-red-400',
    bg: 'bg-white',
    iconBg: 'bg-red-50 text-red-650 border border-red-200/40',
    accent: 'bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500',
    accentText: 'text-red-700'
  },
  Medium: {
    icon: AlertTriangle,
    badge: 'badge-warning',
    border: 'border-amber-200/60 hover:border-amber-400',
    bg: 'bg-white',
    iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/40',
    accent: 'bg-gradient-to-r from-amber-500/5 to-transparent border-l-4 border-amber-500',
    accentText: 'text-amber-800'
  },
  Low: {
    icon: Info,
    badge: 'badge-success',
    border: 'border-emerald-200/60 hover:border-emerald-400',
    bg: 'bg-white',
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/40',
    accent: 'bg-gradient-to-r from-emerald-500/5 to-transparent border-l-4 border-emerald-55',
    accentText: 'text-emerald-800'
  },
};

export default function AlertCard({ alert, onResolve }) {
  const navigate = useNavigate();
  const config = riskConfig[alert.risk_level] || riskConfig.Low;
  const Icon = config.icon;

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleResolve = async (e) => {
    e.stopPropagation(); // Avoid navigating to profile
    try {
      const res = await fetch(`/api/alerts/${alert.id}/resolve`, { method: 'PATCH' });
      if (res.ok && onResolve) {
        onResolve();
      }
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const isResolved = alert.resolution_status === 'Resolved';

  return (
    <div
      id={`alert-card-${alert.id}`}
      onClick={() => navigate(`/cow/${alert.cow_id}`)}
      className={`
        premium-card ${config.bg} ${config.border}
        p-5 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
      `}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm font-mono flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Cow #{alert.tag_number}
              </span>
              <span className={config.badge}>
                {alert.risk_level}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-1.5 uppercase">{alert.alert_type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeAgo(alert.created_at)}</span>
        </div>
      </div>

      {/* ── AI Reasoning / Description ───────────────────────────────── */}
      {alert.risk_level === 'High' && !isResolved ? (
        <div className={`mb-4 p-4.5 rounded-xl ${config.accent} animate-fade-in-up shadow-sm`}>
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className={`w-4 h-4 ${config.accentText}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${config.accentText}`}>
              AI Fusion Analysis
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
            {alert.description}
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-550 leading-relaxed mb-4 font-sans line-clamp-3">
          {alert.description}
        </p>
      )}

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2.5">
        <div className="flex items-center gap-2">
          {isResolved ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 font-mono uppercase bg-emerald-50 border border-emerald-200/30 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
            </span>
          ) : (
            <button
              onClick={handleResolve}
              className="px-3 py-1.5 text-[10px] font-bold font-mono text-emerald-700 hover:text-emerald-950 border border-emerald-150 bg-emerald-50 hover:bg-emerald-100/70 rounded-xl transition-all uppercase shrink-0 cursor-pointer"
            >
              Resolve Alert
            </button>
          )}
          <span className="text-slate-300 font-mono text-xs select-none">•</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-medium">{alert.breed}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-450 group-hover:text-emerald-700 font-mono transition-colors shrink-0">
          <span>View Telemetry</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
