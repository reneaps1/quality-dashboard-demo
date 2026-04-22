import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Package, AlertTriangle, CheckCircle, Users, TrendingDown, Clock, Zap } from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import KPICard from '../components/KPICard';
import InspectionsTable from '../components/InspectionsTable';

const DEFECT_COLORS = {
  'Scratch':        '#EF4444',
  'Dent':           '#F97316',
  'Contamination':  '#EAB308',
  'Color Mismatch': '#8B5CF6',
  'Burr':           '#06B6D4',
  'Deformation':    '#EC4899',
  'Poor Finish':    '#64748B',
  'Assembly Issue': '#10B981',
};

function shortDate(iso) {
  const [, m, d] = iso.split('-');
  return `${m}/${d}`;
}

function formatMonth(ym) {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('en', { month: 'long', year: 'numeric' });
}

function getDaysInMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  const count = new Date(y, m, 0).getDate();
  return Array.from({ length: count }, (_, i) => `${ym}-${String(i + 1).padStart(2, '0')}`);
}

export default function Dashboard() {
  const { inspections, CLIENTS } = useInspections();
  const [clientFilter, setClientFilter] = useState('All');
  const [monthFilter, setMonthFilter]   = useState('2026-04');

  const availableMonths = useMemo(() =>
    [...new Set(inspections.map(r => r.date.slice(0, 7)))].sort().reverse(),
    [inspections],
  );

  const filtered = useMemo(
    () => inspections.filter(r =>
      (clientFilter === 'All' || r.client === clientFilter) &&
      r.date.startsWith(monthFilter)
    ),
    [inspections, clientFilter, monthFilter],
  );

  // ── Quality metrics ──────────────────────────────────────────────────────
  const totalInspected = filtered.reduce((s, r) => s + r.qtyInspected, 0);
  const totalDefective = filtered.reduce((s, r) => s + r.qtyDefective, 0);
  const qualityRate    = totalInspected > 0 ? ((totalInspected - totalDefective) / totalInspected * 100) : 0;
  const activeClients  = new Set(filtered.map(r => r.client)).size;

  // ── Efficiency metrics ───────────────────────────────────────────────────
  const totalHours   = filtered.reduce((s, r) => s + (r.hours || 0), 0);
  const productivity = totalHours > 0 ? Math.round(totalInspected / totalHours) : 0;
  const prodLabel    = productivity >= 70 ? 'High' : productivity >= 45 ? 'Medium' : 'Low';
  const prodColor    = productivity >= 70 ? 'green' : productivity >= 45 ? 'amber' : 'red';

  // ── Chart data ───────────────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(monthFilter);

  const defectsByDay = daysInMonth.map(date => ({
    date: shortDate(date),
    defects: filtered.filter(r => r.date === date).reduce((s, r) => s + r.qtyDefective, 0),
  }));

  const defectsByType = useMemo(() =>
    Object.entries(
      filtered.reduce((acc, r) => {
        acc[r.defectType] = (acc[r.defectType] || 0) + r.qtyDefective;
        return acc;
      }, {}),
    )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value),
    [filtered],
  );

  const hoursByClient = CLIENTS
    .map(c => ({
      client: c,
      hours: filtered.filter(r => r.client === c).reduce((s, r) => s + (r.hours || 0), 0),
    }))
    .filter(d => d.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const hoursByDay = daysInMonth
    .map(date => ({
      date: shortDate(date),
      hours: filtered.filter(r => r.date === date).reduce((s, r) => s + (r.hours || 0), 0),
    }))
    .filter(d => d.hours > 0);

  const topDefect  = defectsByType[0];
  const rateColor  = qualityRate >= 97 ? 'green' : qualityRate >= 94 ? 'amber' : 'red';

  const tooltipStyle = {
    borderRadius: '10px', border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Header + Filters ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inspection Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time quality monitoring across all clients</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Month:</span>
            <select
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>{formatMonth(m)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Client:</span>
            <select
              value={clientFilter}
              onChange={e => setClientFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Clients</option>
              {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Quality KPIs ─────────────────────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quality</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Parts Inspected"
          value={totalInspected.toLocaleString()}
          subtitle={`${filtered.length} inspection records`}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Defects Found"
          value={totalDefective.toLocaleString()}
          subtitle={topDefect ? `Top: ${topDefect.name}` : 'No defects'}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Quality Rate"
          value={`${qualityRate.toFixed(1)}%`}
          subtitle={qualityRate >= 97 ? 'Excellent' : qualityRate >= 94 ? 'Good' : 'Needs attention'}
          icon={CheckCircle}
          color={rateColor}
          highlight={qualityRate >= 97}
        />
        <KPICard
          title="Active Clients"
          value={activeClients}
          subtitle={`of ${CLIENTS.length} total`}
          icon={Users}
          color="purple"
        />
      </div>

      {/* ── Efficiency KPIs ──────────────────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Efficiency</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <KPICard
          title="Total Hours Worked"
          value={`${totalHours} h`}
          subtitle={`${formatMonth(monthFilter)}`}
          icon={Clock}
          color="blue"
        />
        <KPICard
          title="Productivity"
          value={`${productivity} pts/h`}
          subtitle={`${prodLabel} efficiency`}
          icon={Zap}
          color={prodColor}
          highlight={productivity >= 70}
        />
      </div>

      {/* ── Top Defect Alert ─────────────────────────────────────────────── */}
      {topDefect && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <TrendingDown className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-amber-900">Top defect: </span>
            <span className="text-amber-800">
              {topDefect.name} — {topDefect.value} units across {clientFilter === 'All' ? 'all clients' : clientFilter}
            </span>
          </div>
        </div>
      )}

      {/* ── Quality Charts ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Defects by Day</h2>
          <p className="text-xs text-slate-400 mb-4">{formatMonth(monthFilter)}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={defectsByDay} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="defects" name="Defects" fill="#2563EB" radius={[5, 5, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Defects by Type</h2>
          <p className="text-xs text-slate-400 mb-4">Distribution</p>
          {defectsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={defectsByType} dataKey="value" nameKey="name" cx="45%" cy="50%" outerRadius={80} innerRadius={38}>
                  {defectsByType.map(entry => (
                    <Cell key={entry.name} fill={DEFECT_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize: '11px', color: '#475569' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No data</div>
          )}
        </div>
      </div>

      {/* ── Efficiency Charts ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Hours by Client</h2>
          <p className="text-xs text-slate-400 mb-4">Where time is being spent</p>
          {hoursByClient.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hoursByClient} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="client" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} unit=" h" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} formatter={v => [`${v} h`, 'Hours']} />
                <Bar dataKey="hours" name="Hours" fill="#7C3AED" radius={[5, 5, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No data</div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Hours Trend</h2>
          <p className="text-xs text-slate-400 mb-4">Daily workload — active days only</p>
          {hoursByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hoursByDay} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} unit=" h" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} formatter={v => [`${v} h`, 'Hours']} />
                <Bar dataKey="hours" name="Hours" fill="#10B981" radius={[5, 5, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No data</div>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Latest Inspection Records</h2>
          <span className="text-xs text-slate-400">{filtered.length} records</span>
        </div>
        <InspectionsTable records={filtered} maxRows={10} />
      </div>
    </div>
  );
}
