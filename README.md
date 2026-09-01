# 🚚 SARATHI SAMPARK (सारथी संपर्क)
### "Connecting Every Journey. Empowering Every Sarathi."
**Turn Empty Returns Into Profitable Journeys.**

---

## 📌 Executive Summary

**SARATHI SAMPARK** is a production-style, Indian digital logistics technology SaaS platform designed to eliminate unutilized return freight trips. By directly matching transporters returning from primary load drop-offs with verified shippers requiring backhaul freight capacity, Sarathi Sampark maximizes truck utilization, increases driver revenue, eliminates diesel waste, and cuts carbon emissions across Indian national highway freight corridors.

---

## 🏗️ System Architecture

```text
React Frontend (Vite + TS + Tailwind)
                │
          REST APIs (Axios)
                │
  Express Backend (Node.js + TS)
                │
  JWT Authentication & Middleware
                │
   Prisma ORM & MySQL Connector
                │
  MySQL Database & Workbench 8.0
```

---

## 🚀 Key Platform Features

1. **Return Load Marketplace**: Central core engine connecting transporters with nearby verified return loads based on distance, cargo type, net profit, and truck capacity. Features instant multi-step database transactions for load acceptance.
2. **Real Multi-Tenant Authentication & Authorization**: JWT token auth, bcrypt password hashing, session persistence, and role-based views (`Admin`, `Transporter`, `Truck Owner`, `Driver`, `Fleet Manager`, `Shipper`).
3. **Fleet & Driver Management**: Real-time tracking of truck statuses (`Available`, `Active`, `Delayed`, `Maintenance`), driver Rosters, commercial driver license expirations, and safety indexes.
4. **Live Telemetry & GPS Tracking**: Interactive route visualization with pulsing truck markers, ETA predictions, speed readings, and remaining fuel monitoring.
5. **Trips & Delivery Management**: Complete lifecycle status updates (`Order Confirmed` ➔ `Picked Up` ➔ `In Transit` ➔ `Near Destination` ➔ `Delivered`).
6. **Digital Document Management**: Paperless RTO compliance for RC, Commercial Insurance, PUC, Driving Licenses, and E-Way Bills with automated expiration indicators.
7. **Fuel & Maintenance Management**: Fuel consumption anomaly detection (detecting excessive idling/theft) and scheduled workshop preventive maintenance logs.
8. **Financial Ledger & Analytics**: Net profit per KM calculations, expense tracking, return load backhaul revenue stats, and Recharts visual analytics.
9. **Impact & Sustainability Hub**: Real-time metrics showing empty return trip reduction (34% down to 12%), liters of diesel saved, and CO₂ emissions avoided.
10. **Admin Command Center**: User management, transporter/shipper GST verification, document approvals, platform complaints resolution, and system audit logs.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts.
* **Backend**: Node.js, Express.js, TypeScript, JWT (`jsonwebtoken`), `bcryptjs`, CORS, `dotenv`.
* **Database & ORM**: MySQL 8.0+, Prisma ORM (`@prisma/client`), MySQL2 (`mysql2/promise`).
* **Database Tools**: MySQL Workbench compatible SQL schema and seeds.

---

## 🔐 Demo Accounts Credentials

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Transporter** | `transporter@sarathi.in` | `password123` | Transporter Fleet Operations Dashboard |
| **Admin** | `admin@sarathi.in` | `admin123` | Platform Administrative Control & Verification |
| **Truck Owner** | `truckowner@sarathi.in` | `password123` | Individual Fleet Management |
| **Shipper** | `shipper@sarathi.in` | `password123` | Return Load Freight Posting |

---

## 💻 Environment Variables Configuration

Create a `.env` file in the `server` directory (or use `.env.example`):

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sarathi_sampark_db
DATABASE_URL=mysql://root:your_mysql_password@127.0.0.1:3306/sarathi_sampark_db
JWT_SECRET=sarathi_sampark_secure_jwt_secret_key_2026
ADMIN_EMAILS=admin@sarathi.in,admin1@sarathi.in,admin2@sarathi.in,admin3@sarathi.in
```

---

## 🗄️ Database Setup (Prisma & MySQL Workbench)

### Option 1: MySQL Workbench / Direct SQL Schema

1. Open **MySQL Workbench**.
2. Run `database/schema.sql` (or `server/database/schema.sql`) to execute DDL table creation.
3. Run `database/seed.sql` (or `server/database/seed.sql`) to insert initial Indian logistics seed data.

### Option 2: Prisma ORM

```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
```

---

## ⚙️ Running the Project Locally

### 1. Start Express Backend Server

```bash
cd server
npm install
npm run dev
```
*Backend API will run on `http://localhost:5000`*

### 2. Start Vite React Frontend

```bash
cd client
npm install
npm run dev
```
*Frontend application will run on `http://localhost:5173`*

---

## 🔌 API Endpoints Summary

### Authentication
* `POST /api/auth/register` - Create user account
* `POST /api/auth/login` - Authenticate & return JWT
* `GET  /api/auth/me` - Fetch authenticated user session
* `POST /api/auth/logout` - Logout & destroy session

### Return Load Marketplace
* `GET  /api/loads` - Fetch return loads
* `POST /api/loads` - Create return load (Shippers)
* `POST /api/loads/accept` (or `POST /api/loads/:id/accept`) - Transporter load acceptance transaction

### Fleet & Operations
* `GET/POST/PUT/DELETE /api/trucks` - Truck registry CRUD
* `GET/POST/PUT/DELETE /api/drivers` - Driver roster CRUD
* `GET/POST/PUT/DELETE /api/trips` - Trip lifecycle CRUD
* `GET/PUT /api/deliveries` - Delivery tracking
* `GET/POST/PUT/DELETE /api/documents` - Digital compliance documents
* `GET/POST /api/fuel` - Fuel logs & anomaly alerts
* `GET/POST /api/maintenance` - Workshop maintenance logs
* `GET/POST/DELETE /api/expenses` - Operational expenses
* `GET/POST /api/revenue` - Platform P&L revenue statistics
* `GET /api/analytics/dashboard` - Real-time MySQL aggregate metrics
* `GET/PUT/DELETE /api/notifications` - Real-time system notifications
* `POST /api/contact` - Public website contact form submission

---

## 🛡️ License

Copyright © 2026 Sarathi Sampark Logistics Tech Platform. All rights reserved.
