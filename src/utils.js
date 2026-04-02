import { CATEGORY_COLORS } from './data';

export const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Returns { income, expenses, balance } totals from a transaction list */
export function getSummary(txns) {
  let income = 0, expenses = 0;
  for (const t of txns) {
    if (t.type === 'income') income += t.amount;
    else expenses += Math.abs(t.amount);
  }
  return { income, expenses, balance: income - expenses };
}

/** Builds monthly { month, income, expenses } array for charts */
export function getMonthlyData(txns) {
  const map = {};
  for (const t of txns) {
    const key = t.date.slice(0, 7);
    if (!map[key]) {
      const [y, m] = key.split('-');
      const label = new Date(+y, +m - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      map[key] = { month: label, income: 0, expenses: 0 };
    }
    if (t.type === 'income') map[key].income += t.amount;
    else map[key].expenses += Math.abs(t.amount);
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
}

/** Builds [{ name, value, fill }] expense breakdown by category */
export function getCategoryData(txns) {
  const map = {};
  for (const t of txns) {
    if (t.type === 'expense') {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    }
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, fill: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other }))
    .sort((a, b) => b.value - a.value);
}

/** Filters and sorts a transaction list based on filter state */
export function filterTxns(txns, { search, type, category, sortBy, sortDir }) {
  let result = txns.filter(t => {
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) &&
        !t.category.toLowerCase().includes(search.toLowerCase())) return false;
    if (type !== 'all' && t.type !== type) return false;
    if (category !== 'all' && t.category !== category) return false;
    return true;
  });
  result.sort((a, b) => {
    const cmp = sortBy === 'date'
      ? a.date.localeCompare(b.date)
      : Math.abs(a.amount) - Math.abs(b.amount);
    return sortDir === 'asc' ? cmp : -cmp;
  });
  return result;
}
