# SARATHI SAMPARK (सारथी संपर्क)

> **Tagline:** *"Connecting Every Journey. Empowering Every Sarathi."*

Sarathi Sampark is an Indian digital logistics management SaaS platform designed to eliminate empty truck return trips across Bharat. It provides end-to-end fleet monitoring, a return load marketplace, live GPS telemetry, digital compliance document management, diesel anomaly detection, financial P&L ledgers, and platform administration.

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│           (TypeScript, Vite, Tailwind CSS v4)           │
└────────────────────────────┬────────────────────────────┘
                             │
                      HTTP REST APIs
                             │
┌────────────────────────────▼────────────────────────────┐
│                  Express.js Backend API                 │
│         (Node.js, TypeScript, JWT, bcryptjs)            │
└────────────────────────────┬────────────────────────────┘
                             │
                     mysql2 Connection
                             │
┌────────────────────────────▼────────────────────────────┐
│                    MySQL Database                       │
│      (Normalized Relational DB: sarathi_sampark_db)     │
└─────────────────────────────────────────────────────────┘
```

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts.
- **Backend API:** Node.js, Express.js, TypeScript, JWT Authentication (`jsonwebtoken`), Password Hashing (`bcryptjs`).
- **Database:** MySQL 8.0+ (Relational Database with Foreign Key constraints, Indexes, and Parameterized Queries).

---

## 🗄️ Database Table Overview (13 MySQL Tables)

The database schema (`database/schema.sql`) contains 13 normalized tables:

1. **`users`**: User registration, login, roles (`Transporter`, `Truck Owner`, `Driver`, `Fleet Manager`, `Shipper / Business`, `Admin`), GST credentials, and password hashes.
2. **`trucks`**: Fleet registry (`truck_id`, `plate_number`, `model`, `type`, `capacity`, `driver`, `status`, `location`, `fuel`, `mileage`, service/insurance expiries).
3. **`drivers`**: Commercial driver roster (`name`, `phone`, `photo`, `assigned_truck`, `trips_completed`, `rating`, `safety_score`, `license_number`, `status`).
4. **`return_loads`**: Return Load Marketplace listings (`load_id`, `pickup`, `destination`, `distance`, `cargo`, `weight`, `offered_price`, `estimated_fuel_cost`, `estimated_profit`, `verified_shipper`, `shipper_name`, `status`, `accepted_by_truck`).
5. **`trips`**: Active dispatch and trip progress (`trip_id`, `truck`, `driver`, `origin`, `destination`, `distance`, `start_time`, `eta`, `status`, `progress`, `current_lat`, `current_lng`).
6. **`deliveries`**: Order deliveries (`delivery_id`, `customer`, `pickup`, `destination`, `truck`, `driver`, `expected_delivery`, `status`).
7. **`digital_documents`**: RTO & compliance vault (`doc_id`, `title`, `category`, `entity`, `upload_date`, `expiry_date`, `status`, `file_size`, `document_number`).
8. **`fuel_metrics`**: Fuel telemetry & refill logs (`metric_id`, `truck_id`, `plate_number`, `driver`, `fuel_consumed_liters`, `fuel_cost`, `avg_km_l`, `baseline_km_l`, `anomaly_percentage`, `has_anomaly`, `anomaly_reason`).
9. **`maintenance_records`**: Servicing logs (`record_id`, `truck_id`, `plate_number`, `service_type`, `scheduled_date`, `completed_date`, `cost`, `status`, `mechanic_center`, `notes`).
10. **`expenses`**: Operating financial expenses (`expense_id`, `category`, `amount`, `date`, `truck`, `description`).
11. **`notifications`**: Platform alerts & marketplace notifications (`notif_id`, `type`, `message`, `time_ago`, `is_read`).
12. **`transporter_verifications`**: Admin KYC queue for Transporters (`verification_id`, `company_name`, `owner_name`, `gst_number`, `truck_count`, `mobile`, `city`, `status`).
13. **`shipper_verifications`**: Admin approval queue for Freight Shippers (`verification_id`, `company_name`, `contact_person`, `gst_number`, `loads_posted`, `mobile`, `city`, `status`).

---

## ⚙️ Environment Variables Configuration

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Connection Settings
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sarathi_sampark_db

# Authentication Secrets
JWT_SECRET=sarathi_sampark_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
```

---

## 🛠️ MySQL Installation & Database Setup

### Step 1: Install MySQL Server
If you don't have MySQL installed:
- Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
- Ensure the MySQL service is running on port `3306`.

### Step 2: Create Database & Schema
Run the schema script to set up tables and constraints:
```bash
mysql -u root -p < server/database/schema.sql
```

### Step 3: Seed Sample Logistics Data
Populate the database with sample trucks, loads, documents, and users:
```bash
mysql -u root -p sarathi_sampark_db < server/database/seed.sql
```
*Alternatively, running `npm run seed` inside `server/` will automatically initialize and populate the database.*

---

## 🚀 How to Run the Application

### 1. Start the Backend API Server
```bash
cd server
npm install
npm run dev
```
- Express API running at: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

### 2. Start the Frontend Web Application
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
- Vite Dev Server running at: `http://localhost:5173`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user with bcrypt password hash |
| **POST** | `/api/auth/login` | Log in user and return JWT token |
| **GET** | `/api/auth/me` | Fetch authenticated user profile |
| **GET** | `/api/trucks` | Get all fleet trucks |
| **POST** | `/api/trucks` | Add a new truck to fleet |
| **GET** | `/api/drivers` | Get driver roster |
| **POST** | `/api/drivers` | Add a new driver |
| **GET** | `/api/loads` | Get return loads marketplace listings |
| **POST** | `/api/loads` | Post a new return load |
| **POST** | `/api/loads/accept` | Accept a load, assign truck, create active trip & delivery |
| **GET** | `/api/trips` | Get active and completed trips |
| **POST** | `/api/trips` | Create new dispatch trip |
| **GET** | `/api/deliveries` | Get delivery status |
| **GET** | `/api/documents` | Get digital compliance repository |
| **POST** | `/api/documents` | Upload compliance document |
| **GET** | `/api/fuel` | Get fuel metrics and anomaly alerts |
| **POST** | `/api/fuel` | Log diesel refill and compute KM/L efficiency |
| **GET** | `/api/maintenance` | Get maintenance records |
| **POST** | `/api/maintenance` | Schedule vehicle servicing |
| **GET** | `/api/expenses` | Get P&L operating expenses |
| **POST** | `/api/expenses` | Log new expense |
| **GET** | `/api/notifications` | Get user notifications |
| **PUT** | `/api/notifications/:id/read` | Mark alert as read |
| **GET** | `/api/admin/transporters` | Get admin transporter KYC verification queue |
| **GET** | `/api/admin/shippers` | Get admin shipper approval queue |

---

## 🔍 Troubleshooting Instructions

1. **MySQL Connection Error (`ECONNREFUSED 127.0.0.1:3306`):**
   - Check if MySQL service is running (`net start MySQL80` on Windows or `sudo service mysql start` on Linux).
   - Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_PORT` in `server/.env`.
   - The server automatically handles database initialization and falls back gracefully to local storage if MySQL is temporarily unreachable.

2. **JWT Authentication Error:**
   - If receiving 401 Unauthorized errors, ensure `sarathi_token` is saved in `localStorage`. Logging out and logging back in regenerates a valid JWT token.

3. **CORS Error:**
   - The backend server has `cors()` enabled for `http://localhost:5173`.
