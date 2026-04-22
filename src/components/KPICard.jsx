const colorMap = {
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-emerald-50 text-emerald-600',
  red:    'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  amber:  'bg-amber-50 text-amber-600',
};

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'blue', highlight }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border transition-shadow hover:shadow-md ${highlight ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1 tabular-nums">{value}</div>
      <div className="text-sm font-semibold text-slate-600">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );
}
