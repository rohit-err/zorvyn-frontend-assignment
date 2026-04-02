import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmt, fmtDate, getSummary, getMonthlyData, getCategoryData } from '../utils';

const CARD_STYLES = {
  indigo:  { bg: '#eef2ff', text: '#4f46e5' },
  emerald: { bg: '#ecfdf5', text: '#059669' },
  rose:    { bg: '#fff1f2', text: '#e11d48' },
};

function SummaryCard({ label, value, icon: Icon, color }) {
  const { bg, text } = CARD_STYLES[color];
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="p-2 rounded-lg" style={{ backgroundColor: bg }}>
          <Icon size={18} style={{ color: text }} />
        </span>
      </div>
      <p className="text-2xl font-bold" style={{ color: text }}>{fmt(value)}</p>
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-sm shadow-md">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
};

export default function Dashboard({ transactions }) {
  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categories = useMemo(() => getCategoryData(transactions), [transactions]);
  const recent = useMemo(() => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5), [transactions]);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Balance" value={summary.balance}  icon={Wallet}      color="indigo"  />
        <SummaryCard label="Total Income"  value={summary.income}   icon={TrendingUp}  color="emerald" />
        <SummaryCard label="Total Expenses" value={summary.expenses} icon={TrendingDown} color="rose"   />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Monthly Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="income"   name="Income"   stroke="#6366f1" fill="url(#gIncome)"  strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fill="url(#gExpense)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Spending by Category</h2>
          {categories.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">No expense data</p>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={categories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" />
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Transactions</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No transactions yet</p>
        ) : (
          <ul className="space-y-3">
            {recent.map(t => (
              <li key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg ${t.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                    {t.type === 'income'
                      ? <ArrowUpRight size={14} className="text-emerald-600" />
                      : <ArrowDownRight size={14} className="text-rose-600" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{t.description}</p>
                    <p className="text-xs text-slate-400">{fmtDate(t.date)} · {t.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{fmt(Math.abs(t.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
