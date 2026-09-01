import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const pool = await getDbPool();
    if (!pool) {
      return NextResponse.json({ message: 'Database offline. Local mock DB will reset on page reload.' });
    }

    const defaultPass = await hashPassword('password123');

    // Reset foreign keys and clear tables
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE login_history');
    await pool.query('TRUNCATE TABLE audit_logs');
    await pool.query('TRUNCATE TABLE fuel_metrics');
    await pool.query('TRUNCATE TABLE maintenance_records');
    await pool.query('TRUNCATE TABLE expenses');
    await pool.query('TRUNCATE TABLE digital_documents');
    await pool.query('TRUNCATE TABLE deliveries');
    await pool.query('TRUNCATE TABLE trips');
    await pool.query('TRUNCATE TABLE return_loads');
    await pool.query('TRUNCATE TABLE drivers');
    await pool.query('TRUNCATE TABLE trucks');
    await pool.query('TRUNCATE TABLE transporter_verifications');
    await pool.query('TRUNCATE TABLE shipper_verifications');
    await pool.query('TRUNCATE TABLE users');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert clean initial default users
    await pool.execute(
      `INSERT INTO users (id, name, email, mobile, password_hash, role, company_name, onboarded) VALUES
       (1, 'Srinivas Murthy', 'transporter@sarathi.in', '+91-9845011223', ?, 'Transporter', 'Sarathi Transports Pvt Ltd', TRUE),
       (2, 'Rahul Kumar', 'truckowner@sarathi.in', '+91-9876543210', ?, 'Truck Owner', 'Rahul Logistics Fleet', TRUE),
       (3, 'Admin Control', 'admin@sarathi.in', '+91-9000000000', ?, 'Admin', 'Sarathi Sampark HQ', TRUE),
       (4, 'UltraTech Logistics', 'shipper@sarathi.in', '+91-9822055667', ?, 'Shipper / Business', 'UltraTech Cement Dispatch Hub', TRUE)`,
      [defaultPass, defaultPass, defaultPass, defaultPass]
    );

    // Insert clean initial trucks
    await pool.execute(
      `INSERT INTO trucks (truck_id, plate_number, model, type, capacity, driver, status, location, fuel, mileage) VALUES
       ('TRK-101', 'KA-01-MJ-2034', 'Tata Prima 4930.S', 'Trailer', '40 Tons', 'Rahul Kumar', 'Active', 'Bengaluru', 74, 42300),
       ('TRK-102', 'MH-12-HQ-5678', 'Ashok Leyland Ecomet', 'Container', '15 Tons', 'Vikram Singh', 'Available', 'Mumbai', 90, 65100),
       ('TRK-103', 'DL-01-KA-1122', 'BharatBenz 3523R', 'Open Body', '25 Tons', 'Sandeep Sharma', 'Active', 'Delhi', 45, 38200),
       ('TRK-104', 'KA-03-PL-9081', 'Mahindra Blazo X', 'Trailer', '35 Tons', 'Amit Patel', 'Delayed', 'Nellore', 32, 51200),
       ('TRK-105', 'GJ-01-ZZ-9999', 'Tata Signa 2821.T', 'Container', '20 Tons', 'Rajesh Varma', 'Maintenance', 'Ahmedabad', 15, 87400)`
    );

    // Insert clean initial return loads
    await pool.execute(
      `INSERT INTO return_loads (load_id, pickup, destination, distance, cargo, weight, offered_price, estimated_fuel_cost, estimated_profit, shipper_name, status) VALUES
       ('LOAD #SS-2048', 'Chennai', 'Bengaluru', 350, 'Industrial Equipment', '8 Tons', 18500.00, 6200.00, 12300.00, 'L&T Heavy Engineering', 'Available'),
       ('LOAD #SS-2049', 'Mumbai', 'Pune', 150, 'Auto Components', '12 Tons', 14200.00, 3800.00, 10400.00, 'Tata Motors Supply Chain', 'Available')`
    );

    return NextResponse.json({ success: true, message: 'MySQL Database reset and seeded with clean initial data successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
