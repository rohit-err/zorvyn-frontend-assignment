import { useMemo } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { fmt, getSummary, getMonthlyData, getCategoryData } from '../utils';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-sm shadow-md">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>)}
    </div>
  );
};

function InsightCard({ icon: Icon, iconColor, label, children }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={15} className={iconColor} />
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function Insights({ transactions }) {
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categories = useMemo(() => getCategoryData(transactions), [transactions]);
  const { income, expenses } = useMemo(() => getSummary(transactions), [transactions]);

  const topCategory = categories[0] ?? null;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const monthlyComparison = monthly.length >= 2
    ? { diff: monthly.at(-1).expenses - monthly.at(-2).expenses }
    : null;

  const bestMonth = monthly.reduce((best, m) => {
    const saving = m.income - m.expenses;
    return saving > (best?.saving ?? -Infinity) ? { ...m, saving } : best;
  }, null);

  if (transactions.length === 0) {
    return <div className="card p-10 text-center text-slate-400 text-sm">No data to generate insights.</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-base font-semibold text-slate-800">Insights</h1>
        <p className="text-xs text-slate-400 mt-0.5">Key observations from your financial data.</p>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard icon={AlertCircle} iconColor="text-rose-500" label="Top Spending">
          {topCategory ? (
            <>
              <p className="text-lg font-bold text-slate-800">{topCategory.name}</p>
              <p className="text-sm text-rose-600 font-medium">{fmt(topCategory.value)}</p>
            </>
          ) : <p className="text-sm text-slate-400">No expenses</p>}
        </InsightCard>

        <InsightCard
          icon={monthlyComparison?.diff > 0 ? TrendingUp : TrendingDown}
          iconColor={monthlyComparison?.diff > 0 ? 'text-rose-500' : 'text-emerald-500'}
          label="vs Last Month"
        >
          {monthlyComparison ? (
            <>
              <p className={`text-lg font-bold ${monthlyComparison.diff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {monthlyComparison.diff > 0 ? '+' : ''}{fmt(monthlyComparison.diff)}
              </p>
              <p className="text-xs text-slate-400">in expenses</p>
            </>
          ) : <p className="text-sm text-slate-400">Not enough data</p>}
        </InsightCard>

        <InsightCard icon={TrendingUp} iconColor="text-indigo-500" label="Savings Rate">
          <p className={`text-lg font-bold ${savingsRate >= 20 ? 'text-emerald-600' : savingsRate >= 0 ? 'text-amber-600' : 'text-rose-600'}`}>
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400">of total income</p>
        </InsightCard>

        <InsightCard icon={Award} iconColor="text-amber-500" label="Best Month">
          {bestMonth ? (
            <>
              <p className="text-lg font-bold text-slate-800">{bestMonth.month}</p>
              <p className="text-sm text-emerald-600 font-medium">Saved {fmt(bestMonth.saving)}</p>
            </>
          ) : <p className="text-sm text-slate-400">No data</p>}
        </InsightCard>
      </div>

      {/* Monthly bar chart */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Monthly Comparison</h2>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="income"   name="Income"   fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Spending by Category</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No expense data</p>
        ) : (
          <div className="space-y-3">
            {categories.map(({ name, value, fill }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{name}</span>
                  <span className="font-semibold text-slate-700">{fmt(value)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(value / categories[0].value) * 100}%`, backgroundColor: fill }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
