# CRUD Clinic - Ready project

## What is included
- MySQL DDL script: `scripts/ddl_clinic.sql`
- Node.js + Express API with CRUD for `products` and `users`.
- CSV upload endpoint: `POST /api/upload/products` (multipart/form-data, field `file`) that bulk-inserts products and auto-creates categories.
- Sample CSV: `sample_products.csv`

## Quick start
1. Copy `.env.example` to `.env` and set DB credentials.
2. Create the database and tables:
   - Using MySQL Workbench or CLI: `mysql -u root -p < scripts/ddl_clinic.sql`
3. Install dependencies:
   - `npm install`
4. Run server:
   - `npm run dev` (requires nodemon) or `npm start`
5. Endpoints:
   - `GET /api/products`
   - `GET /api/products/:id`
   - `POST /api/products`  JSON body `{ name, description, price, category_id }`
   - `PUT /api/products/:id`
   - `DELETE /api/products/:id`
   - Same for `/api/users`
   - `POST /api/upload/products` - form-data file upload (field name: file)

## Notes
- The CSV upload endpoint expects headers: `name,description,price,category`.
- The service uses `fast-csv` and inserts in batches for performance.
- See web references for `LOAD DATA INFILE` and `secure_file_priv` when considering server-side CSV loads.

References:
- mysql2 docs: https://sidorares.github.io/node-mysql2/docs
- fast-csv / multer tutorials (see web)
