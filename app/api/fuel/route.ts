import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows]: any = await pool.execute('SELECT * FROM fuel_metrics ORDER BY id DESC');
      const formatted = rows.map((f: any) => ({
        id: f.metric_id,
        truckId: f.truck_id,
        plateNumber: f.plate_number,
        driver: f.driver,
        fuelConsumedLiters: f.fuel_consumed_liters,
        fuelCost: Number(f.fuel_cost),
        avgKmL: Number(f.avg_km_l),
        baselineKmL: Number(f.baseline_km_l),
        anomalyPercentage: Number(f.anomaly_percentage),
        hasAnomaly: Boolean(f.has_anomaly),
        anomalyReason: f.anomaly_reason,
        lastRefillDate: f.last_refill_date ? new Date(f.last_refill_date).toISOString().split('T')[0] : '2026-08-28'
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
    const { truckId, liters, cost, mileage, driver } = await req.json();
    const metricId = `FUEL-${Math.floor(200 + Math.random() * 800)}`;
    const ltrs = Number(liters) || 200;
    const cst = Number(cost) || 19000;
    const mlg = Number(mileage) || 940;
    const avgKmL = Number((mlg / (ltrs || 1)).toFixed(1));
    const baselineKmL = 4.8;
    const anomalyPercentage = Number((((baselineKmL - avgKmL) / baselineKmL) * 100).toFixed(1));
    const hasAnomaly = anomalyPercentage > 12;
    const anomalyReason = hasAnomaly ? `Fuel consumption ${anomalyPercentage}% above average baseline.` : null;

    const pool = await getDbPool();
    if (pool) {
      const [trucks]: any = await pool.execute('SELECT plate_number FROM trucks WHERE truck_id = ?', [truckId]);
      const plateNumber = trucks.length > 0 ? trucks[0].plate_number : truckId;

      await pool.execute(
        `INSERT INTO fuel_metrics (metric_id, truck_id, plate_number, driver, fuel_consumed_liters, fuel_cost, avg_km_l, baseline_km_l, anomaly_percentage, has_anomaly, anomaly_reason, last_refill_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE())`,
        [metricId, truckId, plateNumber, driver || 'Rahul Kumar', ltrs, cst, avgKmL, baselineKmL, anomalyPercentage, hasAnomaly, anomalyReason]
      );

      await pool.execute(
        `INSERT INTO expenses (expense_id, category, amount, date, truck, description)
         VALUES (?, 'Fuel', ?, CURRENT_DATE(), ?, ?)`,
        [`EXP-${Math.floor(100 + Math.random() * 900)}`, cst, truckId, `Diesel refill ${ltrs}L logged via Fuel Management`]
      );
    }

    return NextResponse.json({
      id: metricId,
      truckId,
      driver: driver || 'Rahul Kumar',
      fuelConsumedLiters: ltrs,
      fuelCost: cst,
      avgKmL,
      baselineKmL,
      anomalyPercentage,
      hasAnomaly,
      anomalyReason,
      lastRefillDate: new Date().toISOString().split('T')[0]
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
