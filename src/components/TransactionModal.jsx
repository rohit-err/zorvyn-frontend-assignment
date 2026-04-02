import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../data';

const blank = { description: '', amount: '', date: '', category: 'Food', type: 'expense' };

/** Add / Edit transaction modal (admin only) */
export default function TransactionModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({ ...transaction, amount: String(Math.abs(transaction.amount)) });
    } else {
      setForm(blank);
    }
  }, [transaction]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  function setType(t) {
    setForm(f => ({
      ...f,
      type: t,
      // reset category when switching to expense if it was set to 'Income'
      category: t === 'expense' && f.category === 'Income' ? 'Food' : f.category,
    }));
  }

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.description.trim()) errs.description = 'Required';
    if (!form.amount || +form.amount <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const amount = form.type === 'expense' ? -Math.abs(+form.amount) : +form.amount;
    const category = form.type === 'income' ? 'Income' : form.category;
    onSave({ ...form, amount, category, id: transaction?.id ?? Date.now() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm">
            {['expense', 'income'].map(t => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 py-2 capitalize transition-colors ${form.type === t ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <input className="input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="e.g. Grocery Store" />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Amount ($)</label>
            <input className="input" type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
            <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
          </div>

          {form.type === 'expense' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{transaction ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
