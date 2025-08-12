# PD - Diego Mena Lovelace

## Description
This project implements a normalized relational model and a simple CRUD system for **Clients**.
It includes scripts to create the database `pd_Diego_mena_lovelace`, CSV files for bulk import, a Node.js + Express backend, a minimal frontend dashboard, Postman collection and README.

## Contents
- normalization.xlsx (1NF, 2NF, 3NF sheets)
- csvs/ (clients.csv, platforms.csv, invoices.csv, transactions.csv)
- database.sql (DDL)
- backend/ (Node.js + Express API)
- frontend/ (simple dashboard)
- postman_collection.json
- er_diagram.png

## Setup (local machine)
1. Install MySQL and make sure a user with privileges (e.g., root) exists.
2. Create the database and tables:
   - Import `database.sql` using your preferred MySQL client (e.g., `mysql -u root -p < database.sql`).
3. Bulk load CSVs into the corresponding tables (examples in the `csvs` folder).
4. Backend:
   - Go to `backend/`
   - Copy `.env.example` to `.env` and fill DB credentials.
   - Run `npm install`
   - Run `npm start`
5. Frontend:
   - Serve the `frontend` folder (or open `frontend/index.html` in the browser). The frontend uses the API at `http://localhost:3000` by default.

## Notes about credentials
This repository DOES NOT include any real credentials. Add your own MySQL username/password in `.env` on the target machine. `.env` is excluded from the repo and ZIP for security.

## Normalization explanation
- 1NF: Original flat sheet with atomic columns (renamed to English).
- 2NF: Separate entities (clients, platforms, invoices, transactions) to remove partial dependencies.
- 3NF: Ensure no transitive dependencies; foreign keys used to reference related entities.

## Advanced queries (available in API endpoints)
- `/reports/total_paid_per_client` - total paid grouped by client.
- `/reports/pending_invoices` - invoices where paid_amount < amount with client and transaction data.
- `/reports/transactions_by_platform/:platform` - transactions filtered by platform name.