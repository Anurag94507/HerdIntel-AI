import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="premium-card p-3.5 border border-slate-200/80 bg-white shadow-lg z-50">
      <p className="text-xs font-bold text-slate-800 mb-2.5 font-sans">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2.5 text-xs mb-1.5 last:mb-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-450 font-sans">{entry.name}:</span>
          <span className="font-extrabold text-slate-800 font-mono">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function CowProfileChart({ telemetry }) {
  if (!telemetry?.length) {
    return (
      <div className="premium-card p-8 text-center text-slate-400 border border-slate-200 bg-slate-50/50">
        No telemetry data available
      </div>
    );
  }

  // Format data for Recharts
  const chartData = telemetry.map((t) => ({
    time: new Date(t.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    'Isolation Score': t.isolation_score,
    'Cough Count': t.audio_cough_count,
  }));

  // Sample down to ~40 points if too many
  const step = Math.max(1, Math.floor(chartData.length / 40));
  const sampled = chartData.filter((_, i) => i % step === 0 || i === chartData.length - 1);

  return (
    <div className="premium-card p-5 sm:p-6 border border-slate-200 shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 font-sans">
            Sensor Telemetry — 7 Day Trend
          </h3>
          <p className="text-xs text-slate-455 mt-1">
            Synchronized dual-axis: Social Isolation vs Respiratory Audio
          </p>
        </div>
        <div className="flex gap-4 font-mono text-[10px] uppercase font-bold shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-[3px] bg-cyan-500 rounded" />
            <span className="text-slate-500">Isolation Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-[3px] bg-orange-500 rounded" />
            <span className="text-slate-500">Cough Count</span>
          </div>
        </div>
      </div>

      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampled} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 'auto']}
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              yAxisId="left"
              y={85}
              stroke="#dc2626"
              strokeDasharray="6 3"
              strokeOpacity={0.6}
              label={{ value: 'Risk Threshold (85%)', fill: '#dc2626', fontSize: 9, position: 'top', fontFamily: 'monospace', fontWeight: 'bold' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Isolation Score"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Cough Count"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#f97316', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
