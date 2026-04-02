import { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Eye, ShieldCheck } from 'lucide-react';
import { MOCK_TRANSACTIONS } from './data';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';

const TABS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb       },
];

const ROLES = [
  { id: 'viewer', label: 'Viewer', icon: Eye },
  { id: 'admin',  label: 'Admin',  icon: ShieldCheck },
];

/** Load persisted transactions and role from localStorage */
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('fd_state') || '{}');
    return {
      transactions: Array.isArray(saved.transactions) ? saved.transactions : MOCK_TRANSACTIONS,
      role: saved.role === 'admin' ? 'admin' : 'viewer',
    };
  } catch {
    return { transactions: MOCK_TRANSACTIONS, role: 'viewer' };
  }
}

function saveState(transactions, role) {
  localStorage.setItem('fd_state', JSON.stringify({ transactions, role }));
}

export default function App() {
  const [{ transactions, role }, setState] = useState(loadState);
  const [tab, setTab] = useState('dashboard');

  function update(nextTxns, nextRole) {
    setState({ transactions: nextTxns, role: nextRole });
    saveState(nextTxns, nextRole);
  }

  function changeRole(r)  { update(transactions, r); }
  function addTxn(t)      { update([t, ...transactions], role); }
  function editTxn(t)     { update(transactions.map(x => x.id === t.id ? t : x), role); }
  function deleteTxn(id)  {
    if (!window.confirm('Delete this transaction?')) return;
    update(transactions.filter(x => x.id !== id), role);
  }

  function renderPage() {
    if (tab === 'transactions') return <Transactions transactions={transactions} role={role} onAdd={addTxn} onEdit={editTxn} onDelete={deleteTxn} />;
    if (tab === 'insights') return <Insights transactions={transactions} />;
    return <Dashboard transactions={transactions} />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-slate-200">
          <span className="text-lg font-bold text-indigo-600 tracking-tight">FinanceIQ</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}>
              <Icon size={17} />{label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base font-bold text-indigo-600 md:hidden">FinanceIQ</span>

            {/* Mobile nav */}
            <nav className="flex md:hidden gap-1">
              {TABS.map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`p-2 rounded-lg transition-colors ${
                    tab === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
                  }`}>
                  <Icon size={20} />
                </button>
              ))}
            </nav>

            {/* Role switcher */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-500 hidden sm:inline">Role:</span>
              <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm">
                {ROLES.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => changeRole(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                      role === id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    <Icon size={14} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
