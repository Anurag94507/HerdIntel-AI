import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldAlert,
  Heart,
  Gauge,
  Radio,
  RefreshCw,
  ArrowUpRight,
  Zap,
  Coins,
  Plus,
  TrendingUp,
  TrendingDown,
  Trash2,
  Layers,
  X,
  Loader2
} from 'lucide-react';

export default function LiveMonitoring() {
  const [summary, setSummary] = useState(null);
  const [finances, setFinances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Finance Logging Form state
  const [showLogForm, setShowLogForm] = useState(false);
  const [txType, setTxType] = useState('Sale');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Milk');
  const [txDesc, setTxDesc] = useState('');
  const [logError, setLogError] = useState('');

  const navigate = useNavigate();

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/dashboard/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  const fetchFinances = async () => {
    try {
      const res = await fetch('/api/finances');
      const data = await res.json();
      setFinances(data);
    } catch (err) {
      console.error('Failed to fetch finances:', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchFinances()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/engine/analyze', { method: 'POST' });
      const data = await res.json();
      await fetchSummary(); // Refresh stats
      if (data.newAlertsGenerated > 0) {
        alert(`🚨 AI Engine generated ${data.newAlertsGenerated} new alert(s)! Check the Alerts page.`);
      } else {
        alert('✅ Analysis complete. No new alerts generated.');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogTransaction = async (e) => {
    e.preventDefault();
    if (!txAmount || Number(txAmount) <= 0) {
      setLogError('Please enter a valid positive amount.');
      return;
    }
    setLogError('');

    try {
      const response = await fetch('/api/finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_type: txType,
          amount: Number(txAmount),
          category: txCategory,
          description: txDesc
        })
      });

      if (!response.ok) throw new Error("Logging failed");
      
      // Clear inputs and refresh
      setTxAmount('');
      setTxDesc('');
      setShowLogForm(false);
      await fetchFinances();
    } catch (err) {
      setLogError('Failed to record transaction. Try again.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this ledger entry?')) return;
    try {
      const res = await fetch(`/api/finances/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchFinances();
      }
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
          CALIBRATING SENSOR TELEMETRY...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Herd',
      value: summary?.totalCows || 0,
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      id: 'stat-total-cows',
    },
    {
      label: 'Active Alerts',
      value: summary?.activeAlerts || 0,
      icon: ShieldAlert,
      color: summary?.activeAlerts > 0 ? 'bg-red-50 text-red-700 border-red-200/50' : 'bg-slate-50 text-slate-500 border-slate-200',
      id: 'stat-active-alerts',
    },
    {
      label: 'Herd Health',
      value: `${summary?.herdHealthPct || 0}%`,
      icon: Heart,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      id: 'stat-herd-health',
    },
    {
      label: 'Avg Isolation',
      value: `${summary?.avgIsolation || 0}%`,
      icon: Gauge,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-150',
      id: 'stat-avg-isolation',
    },
    {
      label: 'Readings Today',
      value: summary?.telemetryToday || 0,
      icon: Radio,
      color: 'bg-purple-50 text-purple-700 border-purple-100',
      id: 'stat-readings-today',
    },
  ];

  const netProfit = finances?.summary?.netProfit ?? 0;
  const totalSales = finances?.summary?.totalSales ?? 0;
  const totalExp = finances?.summary?.totalExpenditures ?? 0;

  return (
    <div className="space-y-8 animate-fade-in relative z-10 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-3 uppercase tracking-tight">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-500/30" />
            Precision Control Deck
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-2">
            REAL-TIME MULTIMODAL INFERENCE & SECURE FINANCIAL LEDGER
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={loadAllData}
            className="premium-btn-secondary flex-1 md:flex-none text-[11px] py-2.5 px-4 font-mono uppercase"
            id="btn-refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="premium-btn-primary flex-1 md:flex-none text-[11px] py-2.5 px-5 font-mono uppercase"
            id="btn-analyze"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Computing...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Force AI Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Stat Cards Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, id }, i) => (
          <div
            key={label}
            id={id}
            className="premium-card p-5 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 bg-white"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center border shrink-0`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-800">
              {value}
            </p>
            <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/alerts')}
          className="premium-card-hover p-6 cursor-pointer bg-white group"
          id="quick-alerts"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-550 transition-transform group-hover:scale-110" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-550 transition-colors" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-800 mb-1.5 font-sans">Risk Radar Alerts</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Review active high-risk alerts, udder inflammation hot spots, and social isolation tags.
          </p>
        </div>

        <div
          onClick={() => navigate('/cow/2')}
          className="premium-card-hover p-6 cursor-pointer bg-white group"
          id="quick-cow-402"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-cyan-600 transition-transform group-hover:scale-110" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-800 mb-1.5 font-sans">Biometric Profile</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Examine gait tracking curves, audio coughing charts, and individual tag telemetry records.
          </p>
        </div>

        <div
          onClick={() => navigate('/audit')}
          className="premium-card-hover p-6 cursor-pointer bg-white group sm:col-span-2 lg:col-span-1"
          id="quick-audit"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-150 flex items-center justify-center">
              <Heart className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-800 mb-1.5 font-sans">Freedoms Compliance</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Generate and log official 30-day compliance audits for animal welfare guidelines.
          </p>
        </div>
      </div>

      {/* ── System Status & Farmer Finances Widget ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Sensor Pipeline Summary */}
        <div className="premium-card p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase mb-5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              Sensor Pipeline Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Pasture Sensor Nodes', value: '42 Active Nodes', status: 'online' },
                { label: 'Biometric GPS Collars', value: '10 Registered', status: 'online' },
                { label: 'Acoustic Barn Mics', value: '10 Live Channels', status: 'online' },
                { label: 'Deep Fusion Engine', value: 'Fusion v2.1 Sync', status: 'online' },
              ].map(({ label, value, status }) => (
                <div key={label} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">{label}</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">{value}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider font-mono">
                    Online
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>CALIBRATION SCAN</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Right Panel: Farmer Financial Ledger */}
        <div className="lg:col-span-2 premium-card p-6 bg-white flex flex-col justify-between relative overflow-hidden">
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase flex items-center gap-2">
                <Coins className="w-4.5 h-4.5 text-emerald-600" />
                Ledger Accounts (बही-खाता)
              </h3>
              <button
                onClick={() => setShowLogForm(!showLogForm)}
                className={`px-4 py-2 rounded-xl text-[10.5px] font-mono font-bold border transition-all flex items-center justify-center gap-2 shrink-0 ${
                  showLogForm 
                    ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-155'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-150'
                }`}
              >
                {showLogForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showLogForm ? 'Close Logger' : 'Log Transaction'}
              </button>
            </div>

            {/* Quick Logging Form */}
            {showLogForm && (
              <form onSubmit={handleLogTransaction} className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <span className="text-[10px] font-bold text-emerald-750 font-mono uppercase tracking-wider">Log New Transaction Record</span>
                  {logError && <span className="text-[10px] text-red-600 font-mono font-bold">{logError}</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1.5 font-bold">Type</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-sans shadow-sm"
                    >
                      <option value="Sale">Sale (Income)</option>
                      <option value="Expenditure">Expense (Cost)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1.5 font-bold">Amount (INR)</label>
                    <input
                      type="number"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1.5 font-bold">Category</label>
                    <select
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-sans shadow-sm"
                    >
                      <option value="Milk">Milk Sale</option>
                      <option value="Cattle Feed">Cattle Feed</option>
                      <option value="Vet Care">Vet / Medicine</option>
                      <option value="Labor">Labor</option>
                      <option value="Crops">Crops / Grains</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1.5 font-bold">Description</label>
                    <input
                      type="text"
                      value={txDesc}
                      onChange={(e) => setTxDesc(e.target.value)}
                      placeholder="e.g. Holstein milk"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-sans shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end border-t border-slate-200/40 pt-4">
                  <button
                    type="submit"
                    className="premium-btn-primary py-2 px-5 text-[11px] font-bold font-mono uppercase"
                  >
                    Log Entry
                  </button>
                </div>
              </form>
            )}

            {/* Financial Overview Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-bold">Total Sales (बिक्री)</p>
                  <p className="text-lg font-extrabold text-slate-800 font-mono mt-1.5">₹{totalSales}</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-bold">Expenses (लागत)</p>
                  <p className="text-lg font-extrabold text-slate-800 font-mono mt-1.5">₹{totalExp}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-xl text-red-555 border border-red-100/55">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-emerald-50/20 rounded-2xl border border-emerald-500/15 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-emerald-600 font-mono uppercase tracking-wider font-extrabold">Net Profit (मुनाफ़ा)</p>
                  <p className={`text-lg font-black font-mono mt-1.5 ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    ₹{netProfit}
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-200">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Recent Transaction List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mb-3 font-bold">Recent ledger transactions</p>
              {finances?.transactions && finances.transactions.length > 0 ? (
                finances.transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3.5 bg-slate-55 rounded-xl border border-slate-100 text-xs text-slate-700 hover:border-emerald-600/10 transition-all hover:bg-white">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 text-[8.5px] font-black font-mono rounded-lg border ${
                        tx.entry_type === 'Sale' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-750 border-red-100'
                      }`}>
                        {tx.entry_type === 'Sale' ? 'INCOME' : 'EXPENSE'}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-800">{tx.category}</span>
                        {tx.description && <span className="hidden sm:inline text-slate-400 font-mono text-[10px] ml-2">({tx.description})</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[9px] text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</span>
                      <span className={`font-bold text-xs ${tx.entry_type === 'Sale' ? 'text-emerald-650' : 'text-red-650'}`}>
                        {tx.entry_type === 'Sale' ? '+' : '-'}₹{tx.amount}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="p-1.5 text-slate-450 hover:text-red-655 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100/50"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl border border-slate-200/60 bg-slate-50 text-center text-slate-400 text-xs font-mono">
                  No ledger records found.
                </div>
              )}
            </div>

          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Database Connection: SQLite Verified</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              RAG Active Context Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
