export const CATEGORIES = ['Food', 'Housing', 'Utilities', 'Health', 'Shopping', 'Entertainment', 'Other'];

// All possible transaction categories including income
export const ALL_CATEGORIES = ['Income', ...CATEGORIES];

export const CATEGORY_COLORS = {
  Food:          '#6366f1',
  Housing:       '#f59e0b',
  Utilities:     '#14b8a6',
  Health:        '#22c55e',
  Shopping:      '#f97316',
  Entertainment: '#ec4899',
  Income:        '#3b82f6',
  Other:         '#94a3b8',
};

export const MOCK_TRANSACTIONS = [
  { id: 1,  date: '2025-04-05', description: 'Salary',          amount:  5200, category: 'Income',        type: 'income'  },
  { id: 2,  date: '2025-04-07', description: 'Rent',            amount: -1400, category: 'Housing',       type: 'expense' },
  { id: 3,  date: '2025-04-10', description: 'Grocery Store',   amount:  -130, category: 'Food',          type: 'expense' },
  { id: 4,  date: '2025-04-13', description: 'Netflix',         amount:   -15, category: 'Entertainment', type: 'expense' },
  { id: 5,  date: '2025-04-16', description: 'Pharmacy',        amount:   -55, category: 'Health',        type: 'expense' },
  { id: 6,  date: '2025-04-18', description: 'Electric Bill',   amount:  -102, category: 'Utilities',     type: 'expense' },
  { id: 7,  date: '2025-04-23', description: 'Freelance Work',  amount:   600, category: 'Income',        type: 'income'  },
  { id: 8,  date: '2025-04-25', description: 'Amazon Purchase', amount:   -95, category: 'Shopping',      type: 'expense' },
  { id: 9,  date: '2025-05-05', description: 'Salary',          amount:  5200, category: 'Income',        type: 'income'  },
  { id: 10, date: '2025-05-07', description: 'Rent',            amount: -1400, category: 'Housing',       type: 'expense' },
  { id: 11, date: '2025-05-10', description: 'Grocery Store',   amount:  -145, category: 'Food',          type: 'expense' },
  { id: 12, date: '2025-05-14', description: 'Concert Tickets', amount:  -120, category: 'Entertainment', type: 'expense' },
  { id: 13, date: '2025-05-17', description: 'Electric Bill',   amount:   -91, category: 'Utilities',     type: 'expense' },
  { id: 14, date: '2025-05-20', description: 'Gym Membership',  amount:   -40, category: 'Health',        type: 'expense' },
  { id: 15, date: '2025-05-22', description: 'Bonus',           amount:   500, category: 'Income',        type: 'income'  },
  { id: 16, date: '2025-05-25', description: 'Clothing Store',  amount:  -220, category: 'Shopping',      type: 'expense' },
  { id: 17, date: '2025-06-05', description: 'Salary',          amount:  5200, category: 'Income',        type: 'income'  },
  { id: 18, date: '2025-06-07', description: 'Rent',            amount: -1400, category: 'Housing',       type: 'expense' },
  { id: 19, date: '2025-06-10', description: 'Grocery Store',   amount:  -165, category: 'Food',          type: 'expense' },
  { id: 20, date: '2025-06-16', description: 'Freelance Work',  amount:   950, category: 'Income',        type: 'income'  },
  { id: 21, date: '2025-06-18', description: 'Electric Bill',   amount:  -110, category: 'Utilities',     type: 'expense' },
  { id: 22, date: '2025-06-22', description: 'Doctor Visit',    amount:  -200, category: 'Health',        type: 'expense' },
  { id: 23, date: '2025-06-25', description: 'Electronics',     amount:  -480, category: 'Shopping',      type: 'expense' },
  { id: 24, date: '2025-06-28', description: 'Spotify',         amount:   -10, category: 'Entertainment', type: 'expense' },
];
