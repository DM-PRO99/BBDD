SPA project with separated backend and frontend.

Folders:
- backend/: Node/Express API. Run `npm install` inside backend/ and then `npm start`.
- frontend/: SPA static files. The backend serves frontend when started (visit http://localhost:3000).

Steps:
1. Create the database using backend/schema.sql:
   mysql -u root -p < backend/schema.sql
2. Copy backend/.env.example -> backend/.env and set DB credentials and JWT_SECRET.
3. In terminal, install backend dependencies:
   cd backend
   npm install
4. Start backend:
   npm start
5. Open browser to http://localhost:3000

Default admin user is auto-created on server start if users table is empty:
  username: admin
  password: admin123
