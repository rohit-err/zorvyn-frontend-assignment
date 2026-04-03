# Finance Dashboard

A clean, interactive finance dashboard built with React, Vite, and Tailwind CSS.

**Live Demo:** https://zorvyn-frontend-assignment-alpha.vercel.app

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deployment

The project is deployed on Vercel. To deploy your own instance:
1. Push the repository to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite — click Deploy

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Recharts (charts)
- Lucide React (icons)

## Features

**Dashboard** — Summary cards (Balance, Income, Expenses), monthly income vs expenses area chart, spending breakdown donut chart, and recent transactions list.

**Transactions** — Searchable and filterable list (by type and category) with sort by date or amount. Admins can add, edit, and delete transactions via a modal form with validation.

**Insights** — Top spending category, month-over-month expense change, savings rate, best saving month, monthly bar chart, and category progress bars.

**Role-Based UI** — Toggle between Viewer (read-only) and Admin (full CRUD) using the header toggle. Roles are simulated on the frontend.

**Data Persistence** — Transactions and selected role are saved to `localStorage`.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx       # Overview with charts and recent transactions
│   ├── Transactions.jsx    # Filterable list with admin controls
│   ├── Insights.jsx        # Spending insights and charts
│   └── TransactionModal.jsx # Add/edit form modal
├── data.js                 # Mock transactions, categories, colors
├── utils.js                # Formatting, filtering, aggregation helpers
├── App.jsx                 # Root — state, layout, routing
├── index.css               # Tailwind + shared component styles
└── main.jsx
```

## State Management

All state (`transactions`, `role`) lives in `App.jsx` using plain `useState` and is passed down as props. No external state library needed for this scope. State is persisted to `localStorage` on every change.

## Assumptions

- All data is mock/static — no backend or API calls.
- Amounts are stored as signed numbers (negative = expense, positive = income).
- Role switching is for UI demonstration only; there is no authentication.
