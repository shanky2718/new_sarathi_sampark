import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows]: any = await pool.execute('SELECT * FROM return_loads ORDER BY id DESC');
      const formatted = rows.map((l: any) => ({
        loadId: l.load_id,
        pickup: l.pickup,
        destination: l.destination,
        distance: l.distance,
        cargo: l.cargo,
        weight: l.weight,
        offeredPrice: Number(l.offered_price),
        estimatedFuelCost: Number(l.estimated_fuel_cost),
        estimatedProfit: Number(l.estimated_profit),
        verifiedShipper: Boolean(l.verified_shipper),
        shipperName: l.shipper_name,
        shipperRating: Number(l.shipper_rating),
        postedTime: l.posted_time,
        status: l.status,
        pickupDate: l.pickup_date ? new Date(l.pickup_date).toISOString().split('T')[0] : '2026-08-29',
        requiredTruckType: l.required_truck_type,
        acceptedByTruck: l.accepted_by_truck,
        acceptedAt: l.accepted_at
      }));
      return NextResponse.json(formatted);
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { pickup, destination, distance, cargo, weight, offeredPrice, estimatedFuelCost, shipperName, requiredTruckType } = await req.json();
    const loadId = `LOAD #SS-${Math.floor(2050 + Math.random() * 500)}`;
    const price = Number(offeredPrice) || 20000;
    const fuelCost = Number(estimatedFuelCost) || 6000;
    const profit = price - fuelCost;

    const pool = await getDbPool();
    if (pool) {
      await pool.execute(
        `INSERT INTO return_loads (load_id, pickup, destination, distance, cargo, weight, offered_price, estimated_fuel_cost, estimated_profit, verified_shipper, shipper_name, shipper_rating, posted_time, status, pickup_date, required_truck_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, 4.80, 'Just now', 'Available', CURRENT_DATE(), ?)`,
        [loadId, pickup, destination, distance || 350, cargo, weight || '10 Tons', price, fuelCost, profit, shipperName || 'Verified Shipper', requiredTruckType || 'Container']
      );

      await pool.execute(
        `INSERT INTO notifications (notif_id, type, message, time_ago, is_read) VALUES (?, 'info', ?, 'Just now', FALSE)`,
        [`NOT-${Date.now().toString().slice(-4)}`, `New Return Load ${loadId} posted for ${pickup} → ${destination}.`]
      );
    }

    return NextResponse.json({
      loadId,
      pickup,
      destination,
      distance: distance || 350,
      cargo,
      weight: weight || '10 Tons',
      offeredPrice: price,
      estimatedFuelCost: fuelCost,
      estimatedProfit: profit,
      verifiedShipper: true,
      shipperName: shipperName || 'Verified Shipper',
      shipperRating: 4.80,
      postedTime: 'Just now',
      status: 'Available'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
