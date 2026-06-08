# Smart Local Business Inventory & Billing System

This repository contains the rebuild of an internal inventory and billing platform used by staff who manage catalog updates, stock movements, and invoice processing for a local business. The goal of this version is to provide a stronger operational foundation with clearer module boundaries, Docker-based local infrastructure, and a real end-to-end slice for inventory and invoice workflows.

## What is implemented

- Next.js frontend shell with operations overview, product catalog, stock control, and billing desk pages
- Node.js and TypeScript API with Express
- PostgreSQL schema for products, inventory transactions, customers, invoices, and invoice items
- Redis-backed product list caching
- Inventory adjustment workflow with transaction history
- Invoice creation workflow with stock deduction and low-stock tracking
- Docker Compose setup for local API, frontend, PostgreSQL, and Redis

## Repository structure

```text
apps/
  api/
  web/
infra/
  postgres/
```

## Architecture notes

- `apps/api` is organized by feature modules instead of one large controller layer
- `apps/web` uses the Next.js App Router and focuses on staff workflows rather than public-facing experiences
- PostgreSQL owns transactional business data
- Redis is used for fast read caching and can be extended for queues or pub/sub later

## Local development

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start infrastructure with `docker compose up --build`

Frontend runs on `http://localhost:3000`

API runs on `http://localhost:4000`

## Environment variables

See `.env.example` for shared defaults.

## Next steps

- Add authentication and role-based access control for manager, cashier, and inventory roles
- Add sales analytics and reporting
- Add background jobs for invoice export and notifications
- Add automated tests and CI workflows
