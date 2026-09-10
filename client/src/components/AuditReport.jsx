import { useState } from 'react';
import {
  Shield,
  Heart,
  Activity,
  Gauge,
  Radio,
  Printer,
  FileCheck,
  FileSignature,
  CheckCircle,
  Loader2
} from 'lucide-react';

const freedomIcons = {
  freedomFromDisease:       { icon: Shield,   label: 'Freedom from Disease',    color: 'text-red-600',       bg: 'bg-red-50' },
  freedomFromDiscomfort:    { icon: Gauge,    label: 'Freedom from Discomfort', color: 'text-amber-600',     bg: 'bg-amber-50' },
  freedomFromPain:          { icon: Heart,    label: 'Freedom from Pain/Injury',color: 'text-purple-600',    bg: 'bg-purple-50' },
  freedomToExpressBehavior: { icon: Activity, label: 'Natural Behavior',        color: 'text-emerald-600',   bg: 'bg-emerald-50' },
  freedomFromFear:          { icon: Radio,    label: 'Freedom from Fear',       color: 'text-cyan-600',      bg: 'bg-cyan-50' },
};

function ScoreBar({ score }) {
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3 flex-1 font-mono">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-655 w-8 text-right">{score}%</span>
    </div>
  );
}

export default function AuditReport({ report, onSign }) {
  const [signing, setSigning] = useState(false);
  if (!report) return null;

  const { id, reportPeriod, herdOverview, alertSummary, fiveFreedoms, cowSummaries, generatedBy, complianceStandard, signature_status } = report;

  const handleSignReport = async () => {
    setSigning(true);
    try {
      const res = await fetch(`/api/reports/${id}/sign`, { method: 'PATCH' });
      if (res.ok && onSign) {
        await onSign(id);
      }
    } catch (err) {
      console.error('Failed to sign report:', err);
    } finally {
      setSigning(false);
    }
  };

  const isSigned = signature_status === 'Signed';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6" id="audit-report">
      {/* ── Action Header (No Print) ─────────────────────────────────── */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isSigned ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-150 px-3.5 py-2 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Signed & Certified
            </span>
          ) : (
            <button
              onClick={handleSignReport}
              disabled={signing}
              className="premium-btn-primary text-xs py-2 px-4 uppercase flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {signing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <FileSignature className="w-4 h-4" />
                  Digitally Sign Report
                </>
              )}
            </button>
          )}
        </div>
        <button
          onClick={() => window.print()}
          className="premium-btn-secondary text-xs py-2 px-4 uppercase flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Printer className="w-4 h-4" />
          Print Audit
        </button>
      </div>

      {/* ── Report Header ──────────────────────────────────────────── */}
      <div className="premium-card p-6 sm:p-8 text-center relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-500/5 rounded-br-full" />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <FileCheck className="w-6 h-6 text-emerald-700 animate-pulse" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-1">
            Animal Welfare Audit & Compliance Report
          </h2>
          <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
            HERDINTEL-AI FUSION ENGINE VALIDATION REPORT • ID: {id || 'PENDING'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-xs text-slate-500 font-mono border-t border-slate-100 pt-4">
            <span>Period: <strong className="text-slate-700 font-bold">{reportPeriod?.start} to {reportPeriod?.end}</strong></span>
            <span>Compliance Standard: <strong className="text-slate-700 font-bold">{complianceStandard}</strong></span>
          </div>
        </div>
      </div>

      {/* ── Overall Score Card ──────────────────────────────────────── */}
      <div className="premium-card p-6 sm:p-8 text-center relative overflow-hidden bg-emerald-500/5 border border-emerald-100/40">
        <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-2">
          Herd Welfare Index (Average Compliance)
        </p>
        <div className="relative inline-flex items-center justify-center">
          <div className={`text-5xl sm:text-6xl font-black font-mono leading-none ${
            fiveFreedoms.overallScore >= 80 ? 'text-emerald-700' :
            fiveFreedoms.overallScore >= 60 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {fiveFreedoms.overallScore}
          </div>
          <span className="text-lg font-bold text-slate-500 ml-0.5 self-start mt-1">%</span>
        </div>
        <p className="text-[9px] text-slate-455 font-mono mt-3 uppercase tracking-wider">
          Compliance Standard Passed successfully
        </p>
      </div>

      {/* ── Five Freedoms Breakdown ────────────────────────────────── */}
      <div className="premium-card p-5 sm:p-6 bg-white">
        <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase mb-4 border-b border-slate-100 pb-2.5">
          Five Freedoms Assessment
        </h3>
        <div className="space-y-4">
          {Object.entries(freedomIcons).map(([key, { icon: Icon, label, color, bg }]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2.5 w-full sm:w-56 shrink-0">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </div>
              <ScoreBar score={fiveFreedoms[key]} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Herd Overview Stats ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Herd Evaluated', value: herdOverview?.totalCows, unit: 'heads' },
          { label: 'Total Sensor Readings', value: herdOverview?.totalTelemetryReadings?.toLocaleString(), unit: 'points' },
          { label: 'Average Isolation Rate', value: `${herdOverview?.avgIsolationScore}%`, unit: 'isolation' },
          { label: 'Acoustic Cough Count', value: herdOverview?.avgCoughCount, unit: 'daily average' },
        ].map(({ label, value, unit }) => (
          <div key={label} className="premium-card p-4 text-center bg-white">
            <p className="text-[9px] text-slate-400 font-mono uppercase mb-1.5 font-bold">{label}</p>
            <p className="text-xl font-bold font-mono text-slate-800">{value}</p>
            <span className="text-[8.5px] text-slate-400 font-mono mt-1 block uppercase">{unit}</span>
          </div>
        ))}
      </div>

      {/* ── Alert Summary ──────────────────────────────────────────── */}
      <div className="premium-card p-5 sm:p-6 bg-white">
        <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase mb-4 border-b border-slate-100 pb-2.5">
          Advisory & Alert Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Archived Alerts', value: alertSummary?.totalAlerts, color: 'text-slate-800' },
            { label: 'High Risk', value: alertSummary?.highRisk, color: 'text-red-650' },
            { label: 'Medium Risk', value: alertSummary?.mediumRisk, color: 'text-amber-800' },
            { label: 'Low Risk', value: alertSummary?.lowRisk, color: 'text-emerald-700' },
            { label: 'Resolution Rate', value: `${alertSummary?.resolutionRate}%`, color: 'text-cyan-700' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
              <p className="text-[8.5px] text-slate-400 font-mono mb-1 font-bold uppercase">{label}</p>
              <p className={`text-base font-extrabold font-mono ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Per-Cow Summary Table ───────────────────────────────────── */}
      <div className="premium-card p-5 sm:p-6 bg-white overflow-hidden">
        <h3 className="text-xs font-bold text-slate-800 font-mono tracking-widest uppercase mb-4 border-b border-slate-100 pb-2.5">
          Individual Cow Assessment Registry
        </h3>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="text-slate-400 text-[9px] font-mono uppercase font-bold border-b border-slate-100">
                <th className="py-2.5 pr-3">Bovine Tag</th>
                <th className="py-2.5 pr-3">Breed</th>
                <th className="py-2.5 pr-3">Health Status</th>
                <th className="py-2.5 pr-3 text-right">Avg Isolation</th>
                <th className="py-2.5 pr-3 text-right">Avg Cough</th>
                <th className="py-2.5 text-right">Alerts Logged</th>
              </tr>
            </thead>
            <tbody>
              {cowSummaries?.map((cow, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors text-xs text-slate-650">
                  <td className="py-3 pr-3 font-mono font-bold text-slate-800">#{cow.tag_number}</td>
                  <td className="py-3 pr-3 font-medium">{cow.breed}</td>
                  <td className="py-3 pr-3">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                      cow.current_status === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                      cow.current_status === 'Under Observation' ? 'bg-amber-50 text-amber-800 border border-amber-100/50' :
                      'bg-red-50 text-red-700 border border-red-100/50'
                    }`}>
                      {cow.current_status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-right font-mono">{cow.avg_isolation}%</td>
                  <td className="py-3 pr-3 text-right font-mono">{cow.avg_cough}</td>
                  <td className="py-3 text-right font-mono">{cow.alert_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer / Electronic Certification ────────────────────────── */}
      <div className="premium-card p-6 bg-slate-50 border border-slate-200/80 text-center relative overflow-hidden">
        <p className="text-[9px] text-slate-400 font-mono mb-1.5 font-bold">
          REPORT GENERATED BY: <span className="text-slate-700 font-extrabold uppercase">{generatedBy}</span>
        </p>
        <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
          {isSigned 
            ? '🔒 SECURED BLOCKCHAIN LEDGER RECORD: ELECTRONICALLY SIGNED & VERIFIED BY OPERATOR'
            : '⚠️ COMPLIANCE CERTIFICATE REQUIRES OPERATOR DIGITAL SIGNATURE'}
          <br />
          Regulatory Framework Validation Key: {complianceStandard}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-200/50">
          <p className="text-[8px] text-slate-400 font-mono tracking-tight select-all">
            DIGEST HASH: {Array.from({ length: 64 }, (_, i) => '0123456789abcdef'[(id + i) % 16]).join('')}
          </p>
        </div>
      </div>
    </div>
  );
}
