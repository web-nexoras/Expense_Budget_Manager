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

## Email verification

- `POST /api/v1/auth/signup` with `name`, `email`, `phone`, and `password` creates an unverified account and emails a 4-digit OTP.
- `POST /api/v1/auth/verify-otp` with `email` and `otp` verifies the account. OTPs expire after 5 minutes.
- `POST /api/v1/auth/resend-otp` with `email` sends a new OTP for an unverified account.

## Main modules

- auth
- categories
- transactions
- budgets
- reports (monthly/category/export)
- recurring (optional)
