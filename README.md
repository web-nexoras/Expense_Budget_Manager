# Expense & Budget Manager Backend

Interview-ready modular MERN REST API (backend-first).

## Scripts

- `npm run dev` → `node --watch server.js`
- `npm start` → `node server.js`

## Setup

1. `cp .env.example .env`
2. Fill DB/JWT/email values
3. `npm install`
4. `npm run dev`

## Health check

- `GET /health`

## Base URL

- `/api/v1`

## Main modules

- auth
- categories
- transactions
- budgets
- reports (monthly/category/export)
- recurring (optional)
