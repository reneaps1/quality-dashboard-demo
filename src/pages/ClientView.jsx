import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { ShieldCheck, Package, AlertTriangle, CheckCircle, Eye, Award } from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
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

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

function shortDate(iso) {
  const [, m, d] = iso.split('-');
  return `${m}/${d}`;
}

export default function ClientView() {
  const { inspections, CLIENTS } = useInspections();
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);

  const records = useMemo(
    () => inspections.filter(r => r.client === selectedClient),
    [inspections, selectedClient],
  );

  const totalInspected = records.reduce((s, r) => s + r.qtyInspected, 0);
  const totalDefective = records.reduce((s, r) => s + r.qtyDefective, 0);
  const qualityRate    = totalInspected > 0 ? ((totalInspected - totalDefective) / totalInspected * 100) : 0;

  const last7Days = getLast7Days();
  const defectsByDay = last7Days.map(date => ({
    date: shortDate(date),
    defects: records.filter(r => r.date === date).reduce((s, r) => s + r.qtyDefective, 0),
  }));

  const defectsByType = useMemo(() =>
    Object.entries(
      records.reduce((acc, r) => {
        acc[r.defectType] = (acc[r.defectType] || 0) + r.qtyDefective;
        return acc;
      }, {}),
    )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value),
    [records],
  );

  const rateGood = qualityRate >= 97;
  const rateOk   = qualityRate >= 94;
  const rateLabel = rateGood ? 'Excellent' : rateOk ? 'Good' : 'Below Target';
  const rateColor = rateGood ? 'text-emerald-600' : rateOk ? 'text-amber-600' : 'text-red-600';
  const rateBg    = rateGood ? 'bg-emerald-50 border-emerald-200' : rateOk ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Client portal header band */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Read-only Client Portal</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Quality Report Portal</h1>
              <p className="text-slate-500 text-sm mt-0.5">Your dedicated quality reports — updated in real time</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <select
                value={selectedClient}
                onChange={e => setSelectedClient(e.target.value)}
                className="bg-transparent text-slate-800 font-bold text-sm focus:outline-none cursor-pointer"
              >
                {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quality summary banner */}
        <div className={`${rateBg} border rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-5`}>
          <div className={`text-6xl font-black ${rateColor} tabular-nums leading-none`}>
            {qualityRate.toFixed(1)}%
          </div>
          <div className="flex-1">
            <div className={`text-xl font-bold ${rateColor} flex items-center gap-2`}>
              {rateGood && <Award className="w-5 h-5" />}
              {rateLabel} Quality Performance
            </div>
            <div className="text-slate-600 text-sm mt-1">
              Based on <strong>{totalInspected.toLocaleString()}</strong> parts inspected ·{' '}
              <strong>{totalDefective}</strong> defects detected
            </div>
            {defectsByType[0] && (
              <div className="text-xs text-slate-500 mt-1">
                Most frequent defect: <span className="font-semibold">{defectsByType[0].name}</span> ({defectsByType[0].value} units)
              </div>
            )}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Parts Inspected', value: totalInspected.toLocaleString(), icon: Package,       color: 'text-blue-600',    bg: 'bg-blue-50' },
            { label: 'Total Defects',   value: totalDefective,                  icon: AlertTriangle,  color: 'text-red-500',     bg: 'bg-red-50' },
            { label: 'Quality Rate',    value: `${qualityRate.toFixed(1)}%`,    icon: CheckCircle,    color: rateColor,           bg: rateGood ? 'bg-emerald-50' : rateOk ? 'bg-amber-50' : 'bg-red-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`${bg} p-2 rounded-xl`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-sm font-medium text-slate-500">{label}</span>
              </div>
              <div className={`text-3xl font-black ${color} tabular-nums`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Defects by Day</h2>
            <p className="text-xs text-slate-400 mb-4">Last 7 days</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={defectsByDay} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="defects" name="Defects" fill="#2563EB" radius={[5, 5, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Defect Breakdown</h2>
            <p className="text-xs text-slate-400 mb-4">By type</p>
            {defectsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={defectsByType} dataKey="value" nameKey="name" cx="45%" cy="50%" outerRadius={80} innerRadius={38}>
                    {defectsByType.map(e => <Cell key={e.name} fill={DEFECT_COLORS[e.name] || '#94a3b8'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                  <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={7}
                    formatter={v => <span style={{ fontSize: '11px', color: '#475569' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No data for this client</div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Inspection History — {selectedClient}</h2>
          <InspectionsTable records={records} maxRows={20} />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-8">
          This portal is read-only. All data is provided by your quality inspection partner. For questions, contact your account manager.
        </p>
      </div>
    </div>
  );
}
