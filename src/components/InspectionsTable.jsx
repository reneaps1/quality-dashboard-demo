function QualityBadge({ rate }) {
  let cls = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (rate < 97) cls = 'bg-amber-50 text-amber-700 border-amber-200';
  if (rate < 94) cls = 'bg-red-50 text-red-700 border-red-200';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cls}`}>
      {rate.toFixed(1)}%
    </span>
  );
}

export default function InspectionsTable({ records, maxRows = 10 }) {
  const rows = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, maxRows);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide">
            <th className="text-left px-4 py-3 font-semibold text-slate-500">Date</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-500">Client</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-500">Part</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-500">Inspector</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-500">Inspected</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-500">Defective</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-500">Defect Type</th>
            <th className="text-center px-4 py-3 font-semibold text-slate-500">Quality</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => {
            const rate = (r.qtyGood / r.qtyInspected) * 100;
            return (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-xs">{r.date}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{r.client}</td>
                <td className="px-4 py-3 text-slate-600">{r.part}</td>
                <td className="px-4 py-3 text-slate-500">{r.inspector}</td>
                <td className="px-4 py-3 text-right text-slate-900 font-semibold tabular-nums">{r.qtyInspected.toLocaleString()}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className={`font-bold ${r.qtyDefective > 10 ? 'text-red-600' : 'text-amber-600'}`}>{r.qtyDefective}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{r.defectType}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <QualityBadge rate={rate} />
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-slate-400">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
