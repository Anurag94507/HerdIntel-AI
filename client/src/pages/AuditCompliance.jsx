import { useState, useEffect } from 'react';
import {
  FileCheck,
  ScrollText,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight
} from 'lucide-react';
import AuditReport from '../components/AuditReport';

export default function AuditCompliance() {
  const [report, setReport] = useState(null);
  const [pastAudits, setPastAudits] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPastAudits = async () => {
    try {
      const res = await fetch('/api/reports/audits');
      const data = await res.json();
      setPastAudits(data);
    } catch (err) {
      console.error('Failed to fetch audits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastAudits();
  }, []);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/reports/generate', { method: 'POST' });
      const data = await res.json();
      // Set the report for immediate display
      setReport({ 
        id: data.auditId, 
        signature_status: 'Unsigned', 
        ...data.report 
      });
      await fetchPastAudits();
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const viewAudit = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReport({
          id: data.id,
          signature_status: data.signature_status,
          generated_at: data.generated_at,
          ...data.report
        });
      }
    } catch (err) {
      console.error('Failed to fetch audit details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10 max-w-5xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between no-print relative z-10 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-3 uppercase tracking-tight">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-500/30" />
            Compliance & Audit Deck
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-2">
            EU ANIMAL WELFARE LEGISLATION FRAMEWORKS & CERTIFIED DIGITAL SIGNATURES
          </p>
        </div>
      </div>

      {/* ── Generate Panel + Past Audits (Audit Dashboard View) ─────── */}
      {!report && (
        <div className="space-y-6 relative z-10">
          
          {/* Audit Generator Card */}
          <div className="premium-card p-8 text-center bg-white border border-slate-200 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-sm">
              <ScrollText className="w-8 h-8" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 mb-2 font-mono uppercase tracking-wide">
              Generate 30-Day Welfare Audit
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed font-sans">
              Aggregates biometric collar metrics, auditory coughing feeds, and active advisory risk indices. Calculates formal compliance scores matching European standards.
            </p>
            <button
              onClick={generateReport}
              disabled={generating}
              className="premium-btn-primary text-xs px-6 py-3 font-mono uppercase cursor-pointer"
              id="btn-generate-report"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Compiling Data...
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 text-white" />
                  Generate Compliant Audit
                </>
              )}
            </button>
          </div>

          {/* Past Audits Registry List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              <span className="text-[10px] text-slate-450 font-mono uppercase">Synchronizing registry...</span>
            </div>
          ) : pastAudits.length > 0 ? (
            <div className="premium-card p-5 sm:p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2 font-mono uppercase tracking-widest border-b border-slate-100 pb-3">
                <Clock className="w-4.5 h-4.5 text-slate-400" />
                Audit Compliance Archives
              </h3>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {pastAudits.map((audit) => (
                  <div
                    key={audit.id}
                    onClick={() => viewAudit(audit.id)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-150/60 hover:border-emerald-600/15 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                        audit.overall_welfare_score >= 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold' :
                        audit.overall_welfare_score >= 60 ? 'bg-amber-50 border-amber-200 text-amber-800 font-extrabold' : 'bg-red-50 border-red-200 text-red-700 font-extrabold'
                      }`}>
                        <span className="text-xs font-mono">
                          {Math.round(audit.overall_welfare_score)}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 font-sans group-hover:text-emerald-700 transition-colors">
                          Welfare Audit #{audit.id}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {new Date(audit.generated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black tracking-widest font-mono uppercase px-2.5 py-1 rounded-lg border ${
                        audit.signature_status === 'Signed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/40'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {audit.signature_status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-450 group-hover:text-emerald-750 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Compliance Standards Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="premium-card p-5 sm:p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-800 mb-4 uppercase tracking-wider font-mono border-b border-slate-100 pb-2.5">
                Legal Standards Framework
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-500 font-sans">
                {[
                  'EU Regulation 2019/6 (Veterinary Compliance)',
                  'OIE International Terrestrial Animal Welfare Code',
                  'Five Freedoms of Animal Welfare guidelines (FAWC)',
                  'Council Animal Protection Directive 98/58/EC',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="premium-card p-5 sm:p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-800 mb-4 uppercase tracking-wider font-mono border-b border-slate-100 pb-2.5">
                Assessment Pipeline Indexes
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-500 font-sans">
                {[
                  'Social isolation indicators aggregated over 30 days',
                  'Herd respiratory indices (cough averages vs baseline)',
                  'Active advisory alerts severity and resolution counts',
                  'Individual biometric tag registry assessment logs',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Rendered Audit Report View ─────────────────────────────── */}
      {report && (
        <div className="relative z-10 space-y-4">
          <div className="no-print">
            <button
              onClick={() => { setReport(null); fetchPastAudits(); }}
              className="premium-btn-secondary flex items-center gap-1.5 text-xs font-bold font-mono uppercase border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer py-2.5 px-4"
              id="btn-back-to-audit"
            >
              ← Back to Archives
            </button>
          </div>
          <AuditReport report={report} onSign={viewAudit} />
        </div>
      )}
    </div>
  );
}
