import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { useInspections } from '../context/InspectionContext';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 rounded-xl border ${err ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'} text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`;

export default function InspectionForm() {
  const { addInspection, CLIENTS, PARTS_BY_CLIENT, DEFECT_TYPES, INSPECTORS } = useInspections();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const emptyForm = {
    client: '', part: '', date: today, inspector: '',
    qtyInspected: '', qtyGood: '', qtyDefective: '',
    defectType: '', hours: '', notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  const parts = form.client ? (PARTS_BY_CLIENT[form.client] || []) : [];

  const set = (field, value) => {
    setErrors(e => ({ ...e, [field]: '' }));
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'client') next.part = '';
      if (field === 'qtyInspected' || field === 'qtyGood') {
        const qi = parseInt(field === 'qtyInspected' ? value : next.qtyInspected) || 0;
        const qg = parseInt(field === 'qtyGood'      ? value : next.qtyGood)      || 0;
        next.qtyDefective = qi >= qg ? String(qi - qg) : '';
      }
      return next;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.client)      e.client      = 'Required';
    if (!form.part)        e.part        = 'Required';
    if (!form.date)        e.date        = 'Required';
    if (!form.inspector)   e.inspector   = 'Required';
    if (!form.qtyInspected || parseInt(form.qtyInspected) <= 0) e.qtyInspected = 'Must be greater than 0';
    if (form.qtyGood === '') e.qtyGood   = 'Required';
    if (parseInt(form.qtyGood) > parseInt(form.qtyInspected))   e.qtyGood = 'Cannot exceed quantity inspected';
    if (!form.defectType)  e.defectType  = 'Required';
    if (!form.hours || parseFloat(form.hours) <= 0) e.hours = 'Required — enter hours worked';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addInspection({
      ...form,
      qtyInspected: parseInt(form.qtyInspected),
      qtyGood:      parseInt(form.qtyGood),
      qtyDefective: parseInt(form.qtyDefective) || 0,
      hours:        parseFloat(form.hours),
    });
    setSaved(true);
  };

  const qualityPreview =
    form.qtyInspected && form.qtyGood !== ''
      ? ((parseInt(form.qtyGood) / parseInt(form.qtyInspected)) * 100)
      : null;

  if (saved) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100">
          <div className="flex justify-center mb-5">
            <div className="bg-emerald-50 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Inspection Saved!</h2>
          <p className="text-slate-500 mb-8">The record has been added and the dashboard is updated.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSaved(false); setForm(emptyForm); setErrors({}); }}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Add Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-start gap-4">
        <div className="bg-blue-50 p-2.5 rounded-xl">
          <ClipboardList className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Inspection Record</h1>
          <p className="text-slate-500 text-sm mt-1">Fill in the details to log a quality inspection.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <Field label="Client *" error={errors.client}>
            <select value={form.client} onChange={e => set('client', e.target.value)} className={inputCls(errors.client)}>
              <option value="">Select client…</option>
              {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Part Name *" error={errors.part}>
            <select
              value={form.part}
              onChange={e => set('part', e.target.value)}
              disabled={!form.client}
              className={`${inputCls(errors.part)} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <option value="">Select part…</option>
              {parts.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>

          <Field label="Inspection Date *" error={errors.date}>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls(errors.date)} />
          </Field>

          <Field label="Inspector *" error={errors.inspector}>
            <select value={form.inspector} onChange={e => set('inspector', e.target.value)} className={inputCls(errors.inspector)}>
              <option value="">Select inspector…</option>
              {INSPECTORS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>

          <Field label="Quantity Inspected *" error={errors.qtyInspected}>
            <input
              type="number" min="1" placeholder="e.g. 500"
              value={form.qtyInspected} onChange={e => set('qtyInspected', e.target.value)}
              className={inputCls(errors.qtyInspected)}
            />
          </Field>

          <Field label="Quantity Good *" error={errors.qtyGood}>
            <input
              type="number" min="0" placeholder="e.g. 490"
              value={form.qtyGood} onChange={e => set('qtyGood', e.target.value)}
              className={inputCls(errors.qtyGood)}
            />
          </Field>

          <Field label="Quantity Defective">
            <input
              type="number" readOnly value={form.qtyDefective}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">Auto-calculated</p>
          </Field>

          <Field label="Defect Type *" error={errors.defectType}>
            <select value={form.defectType} onChange={e => set('defectType', e.target.value)} className={inputCls(errors.defectType)}>
              <option value="">Select type…</option>
              {DEFECT_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>

          <Field label="Inspection Hours *" error={errors.hours}>
            <input
              type="number" min="0.5" max="12" step="0.5" placeholder="e.g. 4"
              value={form.hours} onChange={e => set('hours', e.target.value)}
              className={inputCls(errors.hours)}
            />
            <p className="text-xs text-slate-400 mt-1">Total hours worked on this batch</p>
          </Field>

        </div>

        <div className="mt-6">
          <Field label="Notes (optional)">
            <textarea
              value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={3} placeholder="Any additional observations…"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </Field>
        </div>

        {/* Quality preview */}
        {qualityPreview !== null && !isNaN(qualityPreview) && qualityPreview >= 0 && (
          <div className={`mt-5 p-4 rounded-xl flex items-center gap-4 border ${
            qualityPreview >= 97 ? 'bg-emerald-50 border-emerald-200' :
            qualityPreview >= 94 ? 'bg-amber-50 border-amber-200' :
            'bg-red-50 border-red-200'
          }`}>
            <span className={`text-3xl font-bold tabular-nums ${
              qualityPreview >= 97 ? 'text-emerald-600' :
              qualityPreview >= 94 ? 'text-amber-600' : 'text-red-600'
            }`}>{qualityPreview.toFixed(1)}%</span>
            <div className="text-sm text-slate-600">
              <div className="font-semibold">Projected quality rate</div>
              <div className="text-xs text-slate-400">{form.qtyDefective || 0} defective out of {form.qtyInspected} inspected</div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm text-sm"
          >
            Save Inspection
          </button>
        </div>
      </form>
    </div>
  );
}
