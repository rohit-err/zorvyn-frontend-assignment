import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowUpDown, X } from 'lucide-react';
import { ALL_CATEGORIES, CATEGORY_COLORS } from '../data';
import { fmt, fmtDate, filterTxns } from '../utils';
import TransactionModal from './TransactionModal';

const DEFAULT_FILTERS = { search: '', type: 'all', category: 'all', sortBy: 'date', sortDir: 'desc' };

export default function Transactions({ transactions, role, onAdd, onEdit, onDelete }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modal, setModal] = useState(null); // null | 'add' | transaction object

  const isAdmin = role === 'admin';
  const setFilter = (patch) => setFilters(f => ({ ...f, ...patch }));

  function toggleSort(field) {
    setFilters(f => ({
      ...f,
      sortBy: field,
      sortDir: f.sortBy === field && f.sortDir === 'desc' ? 'asc' : 'desc',
    }));
  }

  const filtered = filterTxns(transactions, filters);
  const hasFilters = filters.search || filters.type !== 'all' || filters.category !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-800">Transactions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdmin ? 'Admin — you can add, edit, and delete.' : 'Viewer — read-only.'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search..." value={filters.search} onChange={e => setFilter({ search: e.target.value })} />
          </div>
          <select className="input sm:w-36" value={filters.type} onChange={e => setFilter({ type: e.target.value })}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="input sm:w-40" value={filters.category} onChange={e => setFilter({ category: e.target.value })}>
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          {['date', 'amount'].map(field => (
            <button key={field} onClick={() => toggleSort(field)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors capitalize ${
                filters.sortBy === field ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              <ArrowUpDown size={11} />
              {field} {filters.sortBy === field ? (filters.sortDir === 'asc' ? '↑' : '↓') : ''}
            </button>
          ))}
          {hasFilters && (
            <button onClick={() => setFilters(DEFAULT_FILTERS)} className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-14">No transactions match your filters.</p>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-left px-5 py-3 font-medium">Description</th>
                    <th className="text-left px-5 py-3 font-medium">Category</th>
                    <th className="text-left px-5 py-3 font-medium">Type</th>
                    <th className="text-right px-5 py-3 font-medium">Amount</th>
                    {isAdmin && <th className="px-5 py-3" />}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(t.date)}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">{t.description}</td>
                      <td className="px-5 py-3.5">
                        <span className="badge text-white text-xs" style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#94a3b8' }}>
                          {t.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'income' ? '+' : '-'}{fmt(Math.abs(t.amount))}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setModal(t)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="sm:hidden divide-y divide-slate-100">
              {filtered.map(t => (
                <li key={t.id} className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{t.description}</p>
                    <p className="text-xs text-slate-400">{fmtDate(t.date)} · {t.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{fmt(Math.abs(t.amount))}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={() => setModal(t)} className="text-slate-400 hover:text-indigo-600"><Pencil size={14} /></button>
                        <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <p className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
              {filtered.length} of {transactions.length} transactions
            </p>
          </>
        )}
      </div>

      {modal && (
        <TransactionModal
          transaction={modal === 'add' ? null : modal}
          onSave={modal === 'add' ? onAdd : onEdit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
