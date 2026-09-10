import { useState, useEffect } from 'react';
import { ShieldAlert, Filter, RefreshCw, Layers, Loader2 } from 'lucide-react';
import AlertCard from '../components/AlertCard';

export default function MultimodalAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const highCount = alerts.filter(a => a.risk_level === 'High').length;
  const medCount = alerts.filter(a => a.risk_level === 'Medium').length;
  const lowCount = alerts.filter(a => a.risk_level === 'Low').length;

  const openCount = alerts.filter(a => a.resolution_status === 'Open').length;
  const resolvedCount = alerts.filter(a => a.resolution_status === 'Resolved').length;

  const filteredAlerts = alerts.filter(alert => {
    const matchesRisk = riskFilter === 'all' || alert.risk_level === riskFilter;
    const matchesStatus = statusFilter === 'all' || alert.resolution_status === statusFilter;
    return matchesRisk && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in relative z-10 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-3 uppercase tracking-tight">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 shadow-sm shadow-red-500/20" />
            Risk Radar Feed
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-2">
            MULTIMODAL AI-GENERATED HERD ADVISORIES & HEALTH WARNINGS
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="premium-btn-secondary flex-1 sm:flex-none text-[11px] py-2.5 px-4 font-mono uppercase w-full sm:w-auto"
          id="btn-refresh-alerts"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Feed
        </button>
      </div>

      {/* ── Filters Bar (Horizontally scrollable on mobile) ──────────────── */}
      <div className="premium-card p-5 space-y-4 bg-white">
        
        {/* Risk Level Filter Chips */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-center gap-2 text-slate-450 shrink-0 select-none">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider uppercase mr-2">Risk Level:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none flex-nowrap -mx-2 px-2 md:-mx-0 md:px-0">
            {[
              { key: 'all',    label: 'All Risk', count: alerts.length },
              { key: 'High',   label: '🔴 High',   count: highCount },
              { key: 'Medium', label: '🟡 Medium', count: medCount },
              { key: 'Low',    label: '🟢 Low',    count: lowCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setRiskFilter(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all border whitespace-nowrap ${
                  riskFilter === key
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/10'
                    : 'text-slate-500 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-100 border-slate-200/60'
                }`}
                id={`filter-risk-${key}`}
              >
                {label} <span className={`ml-1 text-[10px] ${riskFilter === key ? 'text-emerald-100' : 'text-slate-400'}`}>({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Chips (Open vs Resolved) */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-450 shrink-0 select-none">
            <Layers className="w-4 h-4" />
            <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider uppercase mr-2">Status:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none flex-nowrap -mx-2 px-2 md:-mx-0 md:px-0">
            {[
              { key: 'all',      label: 'All Status', count: alerts.length },
              { key: 'Open',     label: '🚨 Open',     count: openCount },
              { key: 'Resolved', label: '✅ Resolved', count: resolvedCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all border whitespace-nowrap ${
                  statusFilter === key
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/10'
                    : 'text-slate-500 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-100 border-slate-200/60'
                }`}
                id={`filter-status-${key}`}
              >
                {label} <span className={`ml-1 text-[10px] ${statusFilter === key ? 'text-emerald-100' : 'text-slate-400'}`}>({count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alert Feed Grid ────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            REFRESHING ADVISORY FEED...
          </p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="premium-card p-14 text-center bg-white border border-slate-200">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-base font-extrabold text-slate-700 mb-2 font-mono uppercase tracking-wide">No Advisories Found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            There are no active alerts matching your current filters. Run a diagnostics telemetry check to update.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onResolve={fetchAlerts} />
          ))}
        </div>
      )}
    </div>
  );
}
