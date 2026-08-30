-- ==========================================
-- SARATHI SAMPARK - MySQL Relational Database Schema
-- Database Name: sarathi_sampark_db
-- ==========================================

CREATE DATABASE IF NOT EXISTS sarathi_sampark_db;
USE sarathi_sampark_db;

-- Disable foreign key checks for clean structure re-creation if needed
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mobile VARCHAR(50) NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Truck Owner', 'Transporter', 'Driver', 'Fleet Manager', 'Shipper / Business', 'Admin') NOT NULL DEFAULT 'Transporter',
  company_name VARCHAR(255) NULL DEFAULT 'Sarathi Transports',
  gst_number VARCHAR(100) NULL,
  address TEXT NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  pincode VARCHAR(20) NULL,
  fleet_size VARCHAR(50) NULL,
  avatar TEXT NULL,
  onboarded BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TRUCKS TABLE
CREATE TABLE IF NOT EXISTS trucks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  truck_id VARCHAR(50) NOT NULL UNIQUE,
  plate_number VARCHAR(50) NOT NULL UNIQUE,
  model VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  capacity VARCHAR(50) NOT NULL,
  driver VARCHAR(255) NOT NULL DEFAULT 'Unassigned',
  status ENUM('Active', 'Delayed', 'Maintenance', 'Available') NOT NULL DEFAULT 'Available',
  location VARCHAR(255) NOT NULL DEFAULT 'Bengaluru',
  fuel INT NOT NULL DEFAULT 100,
  mileage INT NOT NULL DEFAULT 0,
  next_service DATE NULL,
  insurance_expiry DATE NULL,
  fitness_expiry DATE NULL,
  puc_expiry DATE NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_trucks_status (status),
  INDEX idx_trucks_truck_id (truck_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL UNIQUE,
  photo TEXT NULL,
  assigned_truck VARCHAR(50) NULL DEFAULT 'Unassigned',
  trips_completed INT NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) NOT NULL DEFAULT 4.80,
  safety_score INT NOT NULL DEFAULT 95,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_drivers_name (name),
  INDEX idx_drivers_license (license_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. RETURN LOADS MARKETPLACE TABLE
CREATE TABLE IF NOT EXISTS return_loads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  load_id VARCHAR(50) NOT NULL UNIQUE,
  pickup VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  distance INT NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  weight VARCHAR(50) NOT NULL,
  offered_price DECIMAL(12,2) NOT NULL,
  estimated_fuel_cost DECIMAL(12,2) NOT NULL,
  estimated_profit DECIMAL(12,2) NOT NULL,
  verified_shipper BOOLEAN NOT NULL DEFAULT TRUE,
  shipper_name VARCHAR(255) NOT NULL,
  shipper_rating DECIMAL(3,2) NOT NULL DEFAULT 4.80,
  posted_time VARCHAR(100) NOT NULL DEFAULT 'Just now',
  status ENUM('Available', 'Accepted', 'Completed') NOT NULL DEFAULT 'Available',
  pickup_date DATE NULL,
  required_truck_type VARCHAR(100) NOT NULL DEFAULT 'Container',
  accepted_by_truck VARCHAR(50) NULL,
  accepted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_loads_status (status),
  INDEX idx_loads_route (pickup, destination)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  trip_id VARCHAR(50) NOT NULL UNIQUE,
  truck VARCHAR(50) NOT NULL,
  driver VARCHAR(255) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  distance INT NOT NULL,
  start_time DATETIME NOT NULL,
  eta DATETIME NOT NULL,
  status ENUM('Scheduled', 'In Progress', 'Completed', 'Delayed', 'Cancelled') NOT NULL DEFAULT 'In Progress',
  progress INT NOT NULL DEFAULT 0,
  current_lat DECIMAL(10,6) NULL DEFAULT 12.971598,
  current_lng DECIMAL(10,6) NULL DEFAULT 77.594566,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_trips_status (status),
  INDEX idx_trips_truck (truck)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  delivery_id VARCHAR(50) NOT NULL UNIQUE,
  customer VARCHAR(255) NOT NULL,
  pickup VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  truck VARCHAR(50) NOT NULL,
  driver VARCHAR(255) NOT NULL,
  expected_delivery DATETIME NOT NULL,
  status ENUM('Order Confirmed', 'Picked Up', 'In Transit', 'Near Destination', 'Delivered') NOT NULL DEFAULT 'In Transit',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_deliveries_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. DIGITAL DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS digital_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  doc_id VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category ENUM('RC', 'Insurance', 'PUC', 'Driving License', 'GST Certificate', 'Invoice', 'E-Way Bill', 'Permit') NOT NULL,
  entity VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  expiry_date DATE NULL,
  status ENUM('Verified', 'Pending', 'Expiring Soon', 'Expired') NOT NULL DEFAULT 'Verified',
  file_size VARCHAR(50) NOT NULL DEFAULT '1.5 MB',
  document_number VARCHAR(100) NOT NULL UNIQUE,
  file_url TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_docs_category (category),
  INDEX idx_docs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. FUEL METRICS TABLE
CREATE TABLE IF NOT EXISTS fuel_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  metric_id VARCHAR(50) NOT NULL UNIQUE,
  truck_id VARCHAR(50) NOT NULL,
  plate_number VARCHAR(50) NOT NULL,
  driver VARCHAR(255) NOT NULL,
  fuel_consumed_liters INT NOT NULL,
  fuel_cost DECIMAL(12,2) NOT NULL,
  avg_km_l DECIMAL(4,2) NOT NULL,
  baseline_km_l DECIMAL(4,2) NOT NULL DEFAULT 4.80,
  anomaly_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  has_anomaly BOOLEAN NOT NULL DEFAULT FALSE,
  anomaly_reason TEXT NULL,
  last_refill_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_fuel_truck (truck_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. MAINTENANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS maintenance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  record_id VARCHAR(50) NOT NULL UNIQUE,
  truck_id VARCHAR(50) NOT NULL,
  plate_number VARCHAR(50) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  scheduled_date DATE NOT NULL,
  completed_date DATE NULL,
  cost DECIMAL(12,2) NOT NULL,
  status ENUM('Scheduled', 'In Progress', 'Completed', 'Overdue') NOT NULL DEFAULT 'Scheduled',
  mechanic_center VARCHAR(255) NOT NULL,
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_maintenance_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  expense_id VARCHAR(50) NOT NULL UNIQUE,
  category ENUM('Fuel', 'Maintenance', 'Toll', 'Driver Expenses', 'Insurance', 'Other') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  truck VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_expenses_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  notif_id VARCHAR(50) NOT NULL UNIQUE,
  type ENUM('warning', 'info', 'success') NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  time_ago VARCHAR(100) NOT NULL DEFAULT 'Just now',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_notif_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. TRANSPORTER VERIFICATIONS TABLE (ADMIN)
CREATE TABLE IF NOT EXISTS transporter_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  verification_id VARCHAR(50) NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  gst_number VARCHAR(100) NOT NULL,
  truck_count INT NOT NULL DEFAULT 1,
  mobile VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  status ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
  submitted_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_transporters_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. SHIPPER VERIFICATIONS TABLE (ADMIN)
CREATE TABLE IF NOT EXISTS shipper_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  verification_id VARCHAR(50) NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  gst_number VARCHAR(100) NOT NULL,
  loads_posted INT NOT NULL DEFAULT 0,
  mobile VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  status ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
  submitted_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shippers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  user_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT NULL,
  ip_address VARCHAR(50) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. LOGIN HISTORY TABLE
CREATE TABLE IF NOT EXISTS login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  email VARCHAR(255) NOT NULL,
  login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  logout_time DATETIME NULL,
  status ENUM('success', 'failed', 'logout') NOT NULL,
  ip_address VARCHAR(50) NULL,
  user_agent TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_login_user (user_id),
  INDEX idx_login_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
