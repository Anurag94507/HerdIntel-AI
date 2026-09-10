import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Tag,
  Calendar,
  MapPin,
  Activity,
  ShieldAlert,
  Heart,
  Eye,
  LineChart,
  ClipboardList,
  Loader2
} from 'lucide-react';
import CowProfileChart from '../components/CowProfileChart';

/* ── Inline SVG Scanners ─────────────────────────────────────────── */
const UdderThermalGraphic = () => (
  <svg className="w-full h-full bg-slate-50/70 rounded-2xl border border-slate-200/80" viewBox="0 0 200 120">
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
    <circle cx="125" cy="82" r="6" fill="none" stroke="#dc2626" strokeWidth="0.75" />
    <text x="135" y="75" fill="#dc2626" fontSize="6" fontWeight="bold" fontFamily="monospace">HOTSPOT: +2.8°C</text>
    <text x="135" y="83" fill="#dc2626" fontSize="5" fontFamily="monospace">FL-QUARTER</text>
    <text x="10"  y="15" fill="#64748b" fontSize="6" fontFamily="monospace">MODE: THERMAL SCANNER</text>
  </svg>
);

const GaitSkeletalGraphic = () => (
  <svg className="w-full h-full bg-slate-50/70 rounded-2xl border border-slate-200/80" viewBox="0 0 200 120">
    <path d="M 30 70 L 60 50 L 120 50 L 150 65 L 170 55 L 175 60 L 155 80 L 120 85 L 70 85 Z" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2" />
    <path d="M 40 68 L 70 52 L 100 50 L 130 54 Q 140 56, 150 64" fill="none" stroke="#0891b2" strokeWidth="1.5" />
    <path d="M 125 53 L 132 72 L 130 92 L 122 105" fill="none" stroke="#2563eb" strokeWidth="1.5" />
    <path d="M 135 55 L 146 75 L 152 90 L 150 102" fill="none" stroke="#dc2626" strokeWidth="1.5" />
    <path d="M 60 55 L 56 75 L 58 92 L 62 105" fill="none" stroke="#0891b2" strokeWidth="1.5" />
    <circle cx="70"  cy="52"  r="3"   fill="#0891b2" />
    <circle cx="100" cy="50"  r="3"   fill="#0891b2" />
    <circle cx="135" cy="55"  r="3.5" fill="#dc2626" />
    <circle cx="152" cy="90"  r="3"   fill="#dc2626" />
    <circle cx="125" cy="53"  r="3"   fill="#2563eb" />
    <circle cx="130" cy="92"  r="3"   fill="#2563eb" />
    <text x="148" y="48"  fill="#dc2626" fontSize="6" fontWeight="bold" fontFamily="monospace">148° CURVE</text>
    <text x="120" y="115" fill="#dc2626" fontSize="5"             fontFamily="monospace">HIND LEFT HIND LAG (12%)</text>
    <text x="10"  y="15"  fill="#64748b" fontSize="6"             fontFamily="monospace">MODE: OPTICAL GAIT SKETCH</text>
  </svg>
);

export default function CowProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry', 'diagnostics', 'history'

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/cows/${id}`);
        const data = await res.json();
        setCow(data);
      } catch (err) {
        console.error('Failed to fetch cow:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Loading Biometric Profile...</p>
      </div>
    );
  }

  if (!cow) {
    return (
      <div className="premium-card p-12 text-center bg-white border border-slate-200">
        <p className="text-sm font-semibold text-slate-500 font-mono">Bovine registration tag not matched in database.</p>
      </div>
    );
  }

  const isHealthy = cow.current_status === 'Healthy';
  const isObservation = cow.current_status === 'Under Observation';
  
  const statusColor = isHealthy 
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
    : isObservation 
      ? 'text-amber-800 bg-amber-50 border-amber-200' 
      : 'text-red-700 bg-red-50 border-red-200';

  return (
    <div className="space-y-6 animate-fade-in relative z-10 max-w-7xl mx-auto">
      {/* ── Back Navigation ─────────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-slate-450 hover:text-slate-800 transition-colors font-mono uppercase shrink-0 cursor-pointer"
        id="btn-back"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Console
      </button>

      {/* ── Cow Header ─────────────────────────────────────────────── */}
      <div className="premium-card p-6 bg-white">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/5">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {cow.tag_number?.slice(-3)}
              </span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight font-sans">
                Bovine Tag #{cow.tag_number}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  Breed: {cow.breed}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Birth: {cow.birth_date}
                </span>
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-xl border font-mono ${statusColor}`}>
            {cow.current_status}
          </span>
        </div>
      </div>

      {/* ── Stats Summary Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Avg Isolation',
            value: `${cow.stats?.avgIsolation || 0}%`,
            icon: MapPin,
            color: cow.stats?.avgIsolation > 60 ? 'text-red-700 bg-red-50 border-red-200' : 'text-cyan-700 bg-cyan-50 border-cyan-200',
          },
          {
            label: 'Max Isolation',
            value: `${cow.stats?.maxIsolation || 0}%`,
            icon: Activity,
            color: cow.stats?.maxIsolation > 85 ? 'text-red-700 bg-red-50 border-red-200' : 'text-amber-800 bg-amber-50 border-amber-200',
          },
          {
            label: 'Avg Coughs',
            value: cow.stats?.avgCough || 0,
            icon: Heart,
            color: 'text-purple-700 bg-purple-50 border-purple-100',
          },
          {
            label: 'Open Advisories',
            value: cow.alerts?.filter(a => a.resolution_status === 'Open').length || 0,
            icon: ShieldAlert,
            color: 'text-red-700 bg-red-50 border-red-200',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`premium-card p-5 border shadow-sm ${color}`}>
            <div className="flex items-center gap-2 mb-2.5">
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-75 font-mono">{label}</span>
            </div>
            <p className="text-xl sm:text-2xl font-black font-mono tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabbed View Selection (Horizontal scrollable on mobile) ──── */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { key: 'telemetry',   label: 'Telemetry Trend',   icon: LineChart },
          { key: 'diagnostics', label: 'Visual Diagnostics', icon: Eye },
          { key: 'history',     label: 'Advisory Logs',     icon: ClipboardList },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2.5 px-6 py-3.5 border-b-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === key
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/30'
                : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Contents ────────────────────────────────────────────── */}
      <div>
        {/* Tab 1: Telemetry trend line charts */}
        {activeTab === 'telemetry' && (
          <div className="animate-fade-in-up">
            <CowProfileChart telemetry={cow.telemetry} />
          </div>
        )}

        {/* Tab 2: Visual Diagnostic Scanners */}
        {activeTab === 'diagnostics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
            <div className="premium-card p-6 bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase mb-1">Udder Inframetric Scan</h3>
                <span className="text-[9px] text-slate-400 font-mono tracking-wider block mb-4">THERMOGRAPHY HOTSPOT ANALYSIS</span>
                <div className="w-full aspect-video md:h-48">
                  <UdderThermalGraphic />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-5 leading-relaxed font-sans border-t border-slate-100 pt-4">
                Real-time thermal hotspot scanner checks rear quadrants for pre-clinical mastitis anomalies. Alert thresholds are mapped against cow baseline parameters.
              </p>
            </div>

            <div className="premium-card p-6 bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase mb-1">Locomotion Stride Overlay</h3>
                <span className="text-[9px] text-slate-400 font-mono tracking-wider block mb-4">SKELETAL CURVATURE TRACKER</span>
                <div className="w-full aspect-video md:h-48">
                  <GaitSkeletalGraphic />
                </div>
              </div>
              <p className="text-xs text-slate-505 mt-5 leading-relaxed font-sans border-t border-slate-100 pt-4">
                Skeleton tracking vectors measure spine curvature deviation angles and rear limb lagging. Helpful in flagging hoof lesions and gait lameness.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Advisory Logs */}
        {activeTab === 'history' && (
          <div className="premium-card p-6 bg-white animate-fade-in-up space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase mb-1">Advisory logs</h3>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">ARCHIVED AI FUSION NOTIFICATIONS</p>
            </div>
            
            {cow.alerts?.length > 0 ? (
              <div className="space-y-3">
                {cow.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border ${
                      alert.risk_level === 'High' ? 'bg-red-50/50 border-red-200/60' :
                      alert.risk_level === 'Medium' ? 'bg-amber-50/50 border-amber-200/60' :
                      'bg-emerald-50/50 border-emerald-200/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={
                          alert.risk_level === 'High' ? 'badge-danger' :
                          alert.risk_level === 'Medium' ? 'badge-warning' : 'badge-success'
                        }>
                          {alert.risk_level}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 font-sans uppercase">{alert.alert_type}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-sans">
                      {alert.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center border border-slate-200/60 rounded-2xl bg-slate-50">
                <ShieldAlert className="w-8 h-8 text-slate-350 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-455 font-mono uppercase">No Active Warnings</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
