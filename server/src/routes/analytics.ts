import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { pool, isMySQLConnected } from '../config/database';

const router = Router();

// GET ANALYTICS DATA
router.get('/dashboard', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (isMySQLConnected && pool) {
      const [trucksCount]: any = await pool.execute('SELECT COUNT(*) as total FROM trucks');
      const [activeTrucks]: any = await pool.execute("SELECT COUNT(*) as total FROM trucks WHERE status = 'Active'");
      const [availableLoads]: any = await pool.execute("SELECT COUNT(*) as total FROM return_loads WHERE status = 'Available'");
      const [activeTrips]: any = await pool.execute("SELECT COUNT(*) as total FROM trips WHERE status = 'In Progress'");

      return res.json({
        totalTrucks: trucksCount[0].total,
        activeTrucks: activeTrucks[0].total,
        availableReturnLoads: availableLoads[0].total,
        activeTrips: activeTrips[0].total,
        emptyTripReduction: {
          beforeSarathi: 34,
          afterSarathi: 12
        },
        fleetUtilizationRate: 86.5
      });
    }

    return res.json({
      totalTrucks: 18,
      activeTrucks: 12,
      availableReturnLoads: 8,
      activeTrips: 6,
      emptyTripReduction: { beforeSarathi: 34, afterSarathi: 12 },
      fleetUtilizationRate: 86.5
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/fleet', authenticateToken, async (req: AuthRequest, res: Response) => {
  return res.json({ fleetUtilization: 86.5, activeCount: 14, maintenanceCount: 2, idleCount: 2 });
});

router.get('/impact', authenticateToken, async (req: AuthRequest, res: Response) => {
  return res.json({
    emptyTripsReducedPercentage: 31,
    fuelSavedLiters: 148500,
    co2EmissionsAvoidedTons: 395,
    truckUtilizationIncreasedPercentage: 28
  });
});

export default router;
