-- ==========================================
-- SARATHI SAMPARK - MySQL Sample Seed Data
-- ==========================================

USE sarathi_sampark_db;

-- 1. SEED DEFAULT USERS (Passwords hashed using bcryptjs for 'password123')
-- Hash for 'password123': $2a$10$e8w.bZ6FjA2gE6sY1wD1s.29yP1Y2q6Y0J7N0p0k7j0k7j0k7j0k. (or fallback hashed string)

INSERT INTO users (id, name, email, mobile, password_hash, role, company_name, gst_number, city, onboarded) VALUES
(1, 'Srinivas Murthy', 'transporter@sarathi.in', '+91-9845011223', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Transporter', 'Sarathi Transports Pvt Ltd', '29AAACS1234F1Z5', 'Bengaluru', TRUE),
(2, 'Rahul Kumar', 'truckowner@sarathi.in', '+91-9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Truck Owner', 'Kumar Fleet Operators', '29ABCDE1234F1ZH', 'Chennai', TRUE),
(3, 'Admin Control', 'admin@sarathi.in', '+91-9000000000', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'Sarathi Platform Admin', '00ADMIN1234F1Z0', 'Bengaluru', TRUE),
(4, 'UltraTech Logistics', 'shipper@sarathi.in', '+91-9822055667', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Shipper / Business', 'UltraTech Cement Corp', '27AAACU1234F1Z8', 'Mumbai', TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- 2. SEED TRUCKS
INSERT INTO trucks (user_id, truck_id, plate_number, model, type, capacity, driver, status, location, fuel, mileage, next_service, insurance_expiry, fitness_expiry, puc_expiry) VALUES
(1, 'TRK-101', 'KA-01-MJ-2034', 'Tata Prima 4930.S', 'Trailer', '40 Tons', 'Rahul Kumar', 'Active', 'Bengaluru', 74, 42300, '2026-09-15', '2027-02-14', '2027-05-10', '2026-12-05'),
(1, 'TRK-102', 'MH-12-HQ-5678', 'Ashok Leyland Ecomet', 'Container', '15 Tons', 'Vikram Singh', 'Available', 'Mumbai', 90, 65100, '2026-08-20', '2026-08-25', '2027-03-12', '2026-09-18'),
(1, 'TRK-103', 'DL-01-KA-1122', 'BharatBenz 3523R', 'Open Body', '25 Tons', 'Sandeep Sharma', 'Active', 'Delhi', 45, 38200, '2026-10-05', '2027-04-18', '2027-06-20', '2026-11-20'),
(1, 'TRK-104', 'KA-03-PL-9081', 'Mahindra Blazo X', 'Trailer', '35 Tons', 'Amit Patel', 'Delayed', 'Nellore', 32, 51200, '2026-08-16', '2026-11-02', '2027-01-15', '2026-10-10'),
(1, 'TRK-105', 'GJ-01-ZZ-9999', 'Tata Signa 2821.T', 'Container', '20 Tons', 'Rajesh Varma', 'Maintenance', 'Ahmedabad', 15, 87400, '2026-08-09', '2026-10-12', '2026-12-25', '2026-08-20')
ON DUPLICATE KEY UPDATE truck_id=truck_id;

-- 3. SEED DRIVERS
INSERT INTO drivers (user_id, name, phone, assigned_truck, trips_completed, rating, safety_score, license_number, status) VALUES
(1, 'Rahul Kumar', '+91-9876543210', 'TRK-101', 45, 4.80, 96, 'DL-14201300984', 'Active'),
(1, 'Vikram Singh', '+91-9865432107', 'TRK-102', 38, 4.60, 92, 'MH-12201500741', 'Active'),
(1, 'Sandeep Sharma', '+91-9754321098', 'TRK-103', 52, 4.90, 98, 'DL-11201400258', 'Active'),
(1, 'Amit Patel', '+91-9643210987', 'TRK-104', 29, 4.20, 85, 'GJ-01201700369', 'Active'),
(1, 'Rajesh Varma', '+91-9532109876', 'TRK-105', 61, 4.70, 94, 'GJ-02201200147', 'Active')
ON DUPLICATE KEY UPDATE license_number=license_number;

-- 4. SEED RETURN LOADS
INSERT INTO return_loads (load_id, pickup, destination, distance, cargo, weight, offered_price, estimated_fuel_cost, estimated_profit, verified_shipper, shipper_name, shipper_rating, posted_time, status, pickup_date, required_truck_type) VALUES
('LOAD #SS-2048', 'Chennai', 'Bengaluru', 350, 'Industrial Equipment', '8 Tons', 18500.00, 6200.00, 12300.00, TRUE, 'L&T Heavy Engineering', 4.90, '15 mins ago', 'Available', '2026-08-29', 'Container'),
('LOAD #SS-2049', 'Mumbai', 'Pune', 150, 'Auto Components', '12 Tons', 14200.00, 3800.00, 10400.00, TRUE, 'Tata Motors Supply Chain', 4.80, '42 mins ago', 'Available', '2026-08-29', 'Open Body'),
('LOAD #SS-2050', 'Delhi', 'Jaipur', 270, 'FMCG Packaged Goods', '15 Tons', 22000.00, 7100.00, 14900.00, TRUE, 'ITC Freight Network', 4.90, '1 hour ago', 'Available', '2026-08-30', 'Container'),
('LOAD #SS-2051', 'Hyderabad', 'Vijayawada', 275, 'Pharmaceutical Supplies', '6 Tons', 16800.00, 4900.00, 11900.00, TRUE, 'Cipla Express Logistics', 4.70, '2 hours ago', 'Available', '2026-08-29', 'Box Body'),
('LOAD #SS-2052', 'Ahmedabad', 'Surat', 260, 'Textile Rolls & Fabrics', '18 Tons', 24500.00, 6800.00, 17700.00, TRUE, 'Arvind Mills Logistics', 4.60, '3 hours ago', 'Available', '2026-08-30', 'Container')
ON DUPLICATE KEY UPDATE load_id=load_id;

-- 5. SEED TRIPS
INSERT INTO trips (user_id, trip_id, truck, driver, origin, destination, distance, start_time, eta, status, progress, current_lat, current_lng) VALUES
(1, 'TRP-501', 'TRK-101', 'Rahul Kumar', 'Bengaluru', 'Chennai', 350, '2026-08-28 08:00:00', '2026-08-28 16:00:00', 'In Progress', 75, 12.980000, 79.950000),
(1, 'TRP-502', 'TRK-103', 'Sandeep Sharma', 'Delhi', 'Jaipur', 270, '2026-08-28 10:00:00', '2026-08-28 15:30:00', 'In Progress', 90, 26.920000, 75.820000),
(1, 'TRP-503', 'TRK-104', 'Amit Patel', 'Chennai', 'Kolkata', 1660, '2026-08-27 06:00:00', '2026-08-29 18:00:00', 'Delayed', 42, 14.440000, 79.980000),
(1, 'TRP-504', 'TRK-102', 'Vikram Singh', 'Mumbai', 'Pune', 150, '2026-08-28 12:00:00', '2026-08-28 15:30:00', 'Completed', 100, 18.520000, 73.850000)
ON DUPLICATE KEY UPDATE trip_id=trip_id;

-- 6. SEED DELIVERIES
INSERT INTO deliveries (user_id, delivery_id, customer, pickup, destination, truck, driver, expected_delivery, status) VALUES
('1', 'DLV-201', 'Tata Steel Ltd', 'Jamshedpur', 'Pune', 'TRK-107', 'Manoj Yadav', '2026-08-28 15:30:00', 'Delivered'),
('1', 'DLV-202', 'UltraTech Cement', 'Bengaluru', 'Chennai', 'TRK-101', 'Rahul Kumar', '2026-08-28 16:00:00', 'Near Destination'),
('1', 'DLV-203', 'Reliance Retail', 'Delhi', 'Jaipur', 'TRK-103', 'Sandeep Sharma', '2026-08-28 15:30:00', 'In Transit')
ON DUPLICATE KEY UPDATE delivery_id=delivery_id;

-- 7. SEED DIGITAL DOCUMENTS
INSERT INTO digital_documents (user_id, doc_id, title, category, entity, upload_date, expiry_date, status, file_size, document_number) VALUES
(1, 'DOC-101', 'Registration Certificate (RC)', 'RC', 'TRK-101 (KA-01-MJ-2034)', '2026-01-15', NULL, 'Verified', '2.4 MB', 'RC-KA01MJ2034-2023'),
(1, 'DOC-102', 'Commercial Vehicle Insurance', 'Insurance', 'TRK-102 (MH-12-HQ-5678)', '2025-08-26', '2026-08-25', 'Expiring Soon', '1.8 MB', 'INS-MH12HQ5678-88'),
(1, 'DOC-103', 'Pollution Under Control (PUC)', 'PUC', 'TRK-105 (GJ-01-ZZ-9999)', '2026-02-20', '2026-08-20', 'Expired', '0.9 MB', 'PUC-GJ01ZZ9999-12'),
(1, 'DOC-104', 'Heavy Commercial Driving License', 'Driving License', 'Rahul Kumar', '2025-11-10', '2030-05-14', 'Verified', '3.1 MB', 'DL-14201300984')
ON DUPLICATE KEY UPDATE doc_id=doc_id;

-- 8. SEED FUEL METRICS
INSERT INTO fuel_metrics (user_id, metric_id, truck_id, plate_number, driver, fuel_consumed_liters, fuel_cost, avg_km_l, baseline_km_l, anomaly_percentage, has_anomaly, anomaly_reason, last_refill_date) VALUES
(1, 'FUEL-101', 'TRK-103', 'DL-01-KA-1122', 'Sandeep Sharma', 240, 22800.00, 3.90, 4.80, 18.70, TRUE, 'High idling time (4.2 hours) in heavy NCR traffic gridlock', '2026-08-28'),
(1, 'FUEL-102', 'TRK-101', 'KA-01-MJ-2034', 'Rahul Kumar', 210, 19950.00, 4.70, 4.80, 2.10, FALSE, NULL, '2026-08-27')
ON DUPLICATE KEY UPDATE metric_id=metric_id;

-- 9. SEED MAINTENANCE RECORDS
INSERT INTO maintenance_records (user_id, record_id, truck_id, plate_number, service_type, scheduled_date, cost, status, mechanic_center, notes) VALUES
(1, 'MNT-301', 'TRK-105', 'GJ-01-ZZ-9999', 'Full Engine Overhaul & Injector Cleaning', '2026-08-25', 38500.00, 'In Progress', 'Tata Motors Authorized Works - Ahmedabad', 'Injectors undergoing pressure testing. Parts dispatched from regional warehouse.'),
(1, 'MNT-302', 'TRK-102', 'MH-12-HQ-5678', 'Routine 60,000 KM Periodic Service', '2026-09-05', 12000.00, 'Scheduled', 'Ashok Leyland Service Centre - Thane', 'Scheduled engine oil, oil filter, and fuel filter replacement.')
ON DUPLICATE KEY UPDATE record_id=record_id;

-- 10. SEED EXPENSES
INSERT INTO expenses (user_id, expense_id, category, amount, date, truck, description) VALUES
(1, 'EXP-101', 'Fuel', 15400.00, '2026-08-28', 'TRK-101', 'Diesel refill 200L - HP Station'),
(1, 'EXP-102', 'Toll', 1250.00, '2026-08-28', 'TRK-101', 'FASTag Toll charge NH4'),
(1, 'EXP-103', 'Maintenance', 8500.00, '2026-08-27', 'TRK-105', 'Engine oil and air filter change')
ON DUPLICATE KEY UPDATE expense_id=expense_id;

-- 11. SEED NOTIFICATIONS
INSERT INTO notifications (user_id, notif_id, type, message, time_ago, is_read) VALUES
(1, 'NOT-101', 'warning', 'Truck TRK-102 insurance expires in 17 days (2026-08-25).', '10 mins ago', FALSE),
(1, 'NOT-102', 'warning', 'Delivery #DLV-204 to Kolkata has been marked as delayed due to highway closure.', '1 hour ago', FALSE),
(1, 'NOT-103', 'success', 'Delivery #DLV-201 for Tata Steel Ltd completed successfully.', '4 hours ago', TRUE)
ON DUPLICATE KEY UPDATE notif_id=notif_id;

-- 12. SEED TRANSPORTER VERIFICATIONS
INSERT INTO transporter_verifications (verification_id, company_name, owner_name, gst_number, truck_count, mobile, city, status, submitted_date) VALUES
('TRN-801', 'VRL Logistics Partner Unit', 'Srinivas Murthy', '29ABCDE1234F1ZH', 14, '+91-9845011223', 'Hubballi', 'Pending', '2026-08-27'),
('TRN-802', 'Deccan Freight Express', 'Venkat Reddy', '36XYZAB5678G1ZP', 8, '+91-9989022334', 'Hyderabad', 'Verified', '2026-08-20')
ON DUPLICATE KEY UPDATE verification_id=verification_id;

-- 13. SEED SHIPPER VERIFICATIONS
INSERT INTO shipper_verifications (verification_id, company_name, contact_person, gst_number, loads_posted, mobile, city, status, submitted_date) VALUES
('SHP-901', 'UltraTech Cement Dispatch Depot', 'Anand Kulkarni', '27AAACU1234F1Z8', 34, '+91-9822055667', 'Nagpur', 'Verified', '2026-08-15'),
('SHP-902', 'Southern Cotton Mills Producer Org', 'Ramanathan Iyer', '33AAACS9988H1ZV', 12, '+91-9444066778', 'Coimbatore', 'Pending', '2026-08-26')
ON DUPLICATE KEY UPDATE verification_id=verification_id;
