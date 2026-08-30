import { 
  initialTrucks, 
  initialDrivers, 
  initialTrips, 
  initialDeliveries, 
  initialExpenses, 
  initialNotifications,
  initialReturnLoads,
  initialDocuments,
  initialFuelMetrics,
  initialMaintenance,
  initialTransportersReq,
  initialShippersReq,
  Truck, 
  Driver, 
  Trip, 
  Delivery, 
  Expense, 
  Notification,
  ReturnLoad,
  DigitalDocument,
  FuelMetric,
  MaintenanceRecord,
  TransporterVerification,
  ShipperVerification
} from './localData';

const KEYS = {
  TRUCKS: 'sarathi_trucks',
  DRIVERS: 'sarathi_drivers',
  TRIPS: 'sarathi_trips',
  DELIVERIES: 'sarathi_deliveries',
  EXPENSES: 'sarathi_expenses',
  NOTIFICATIONS: 'sarathi_notifications',
  USER: 'sarathi_user',
  LOADS: 'sarathi_return_loads',
  DOCUMENTS: 'sarathi_documents',
  FUEL: 'sarathi_fuel',
  MAINTENANCE: 'sarathi_maintenance',
  TRANSPORTERS: 'sarathi_transporters_req',
  SHIPPERS: 'sarathi_shippers_req'
};

class LocalDB {
  private get<T>(key: string, defaults: T[]): T[] {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  }

  private set<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // User Auth Cache
  getCurrentUser() {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: any) {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  }

  // Trucks
  getTrucks(): Truck[] {
    return this.get<Truck>(KEYS.TRUCKS, initialTrucks);
  }

  addTruck(truck: Omit<Truck, 'status' | 'fuel' | 'driver'> & { driver?: string }): Truck {
    const list = this.getTrucks();
    const newTruck: Truck = {
      ...truck,
      status: 'Available',
      fuel: 100,
      driver: truck.driver || 'Unassigned',
      mileage: Number(truck.mileage) || 0
    };
    list.unshift(newTruck);
    this.set(KEYS.TRUCKS, list);
    this.addNotification('info', `Truck ${truck.truckId} successfully registered in fleet.`);
    return newTruck;
  }

  updateTruck(id: string, updates: Partial<Truck>): Truck | null {
    const list = this.getTrucks();
    const idx = list.findIndex(t => t.truckId === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.set(KEYS.TRUCKS, list);
      return list[idx];
    }
    return null;
  }

  // Drivers
  getDrivers(): Driver[] {
    return this.get<Driver>(KEYS.DRIVERS, initialDrivers);
  }

  addDriver(driver: Omit<Driver, 'tripsCompleted' | 'rating' | 'safetyScore' | 'status'>): Driver {
    const list = this.getDrivers();
    const newDriver: Driver = {
      ...driver,
      tripsCompleted: 0,
      rating: 5.0,
      safetyScore: 95,
      status: 'Active'
    };
    list.unshift(newDriver);
    this.set(KEYS.DRIVERS, list);

    if (driver.assignedTruck && driver.assignedTruck !== 'Unassigned') {
      this.updateTruck(driver.assignedTruck, { driver: driver.name });
    }

    this.addNotification('info', `Driver ${driver.name} registered and assigned to ${driver.assignedTruck || 'no truck'}.`);
    return newDriver;
  }

  updateDriver(name: string, updates: Partial<Driver>): Driver | null {
    const list = this.getDrivers();
    const idx = list.findIndex(d => d.name === name);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.set(KEYS.DRIVERS, list);
      return list[idx];
    }
    return null;
  }

  // Trips
  getTrips(): Trip[] {
    return this.get<Trip>(KEYS.TRIPS, initialTrips);
  }

  addTrip(trip: Omit<Trip, 'tripId' | 'progress' | 'currentLatLng'>): Trip {
    const list = this.getTrips();
    const tripId = `TRP-${Math.floor(500 + Math.random() * 500)}`;
    const newTrip: Trip = {
      ...trip,
      tripId,
      progress: 0,
      currentLatLng: { lat: 12.97, lng: 77.59 }
    };
    list.unshift(newTrip);
    this.set(KEYS.TRIPS, list);

    // Update truck status and driver assignment
    let truckStatus: Truck['status'] = 'Available';
    if (trip.status === 'In Progress') truckStatus = 'Active';
    else if (trip.status === 'Delayed') truckStatus = 'Delayed';
    
    this.updateTruck(trip.truck, { 
      status: truckStatus, 
      location: trip.origin,
      driver: trip.driver
    });

    this.addNotification('info', `New trip ${tripId} scheduled for Truck ${trip.truck} from ${trip.origin} to ${trip.destination}.`);
    return newTrip;
  }

  updateTrip(id: string, updates: Partial<Trip>): Trip | null {
    const list = this.getTrips();
    const idx = list.findIndex(t => t.tripId === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.set(KEYS.TRIPS, list);

      const trip = list[idx];
      // Update corresponding truck state
      if (updates.status) {
        let truckStatus: Truck['status'] = 'Available';
        if (trip.status === 'In Progress') truckStatus = 'Active';
        else if (trip.status === 'Delayed') truckStatus = 'Delayed';

        this.updateTruck(trip.truck, { 
          status: truckStatus,
          location: trip.progress === 100 ? trip.destination : trip.origin
        });
      }

      if (updates.progress === 100 || updates.status === 'Completed') {
        this.addNotification('success', `Trip ${id} completed delivery at ${trip.destination}.`);
      }
      return list[idx];
    }
    return null;
  }

  // Deliveries
  getDeliveries(): Delivery[] {
    return this.get<Delivery>(KEYS.DELIVERIES, initialDeliveries);
  }

  addDelivery(delivery: Omit<Delivery, 'deliveryId' | 'status'>): Delivery {
    const list = this.getDeliveries();
    const deliveryId = `DLV-${Math.floor(200 + Math.random() * 800)}`;
    const newDelivery: Delivery = {
      ...delivery,
      deliveryId,
      status: 'Order Confirmed'
    };
    list.unshift(newDelivery);
    this.set(KEYS.DELIVERIES, list);
    this.addNotification('info', `Delivery ${deliveryId} logged for ${delivery.customer}.`);
    return newDelivery;
  }

  updateDelivery(id: string, status: Delivery['status']): Delivery | null {
    const list = this.getDeliveries();
    const idx = list.findIndex(d => d.deliveryId === id);
    if (idx !== -1) {
      list[idx].status = status;
      this.set(KEYS.DELIVERIES, list);
      if (status === 'Delivered') {
        this.addNotification('success', `Delivery ${id} has been DELIVERED to ${list[idx].customer}.`);
      } else {
        this.addNotification('info', `Delivery ${id} status updated to: ${status}`);
      }
      return list[idx];
    }
    return null;
  }

  // Expenses
  getExpenses(): Expense[] {
    return this.get<Expense>(KEYS.EXPENSES, initialExpenses);
  }

  addExpense(expense: Omit<Expense, 'expenseId'>): Expense {
    const list = this.getExpenses();
    const expenseId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
    const newExpense: Expense = {
      ...expense,
      expenseId
    };
    list.unshift(newExpense);
    this.set(KEYS.EXPENSES, list);
    return newExpense;
  }

  // Notifications
  getNotifications(): Notification[] {
    return this.get<Notification>(KEYS.NOTIFICATIONS, initialNotifications);
  }

  addNotification(type: 'warning' | 'info' | 'success', message: string): Notification {
    const list = this.getNotifications();
    const newNotif: Notification = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      type,
      message,
      time: 'Just now',
      read: false
    };
    list.unshift(newNotif);
    this.set(KEYS.NOTIFICATIONS, list);
    return newNotif;
  }

  markNotificationAsRead(id: string): Notification | null {
    const list = this.getNotifications();
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx].read = true;
      this.set(KEYS.NOTIFICATIONS, list);
      return list[idx];
    }
    return null;
  }

  // Return Load Marketplace
  getLoads(): ReturnLoad[] {
    return this.get<ReturnLoad>(KEYS.LOADS, initialReturnLoads);
  }

  addLoad(load: Omit<ReturnLoad, 'loadId' | 'status' | 'postedTime'>): ReturnLoad {
    const list = this.getLoads();
    const loadId = `LOAD #SS-${Math.floor(2050 + Math.random() * 500)}`;
    const newLoad: ReturnLoad = {
      ...load,
      loadId,
      status: 'Available',
      postedTime: 'Just now'
    };
    list.unshift(newLoad);
    this.set(KEYS.LOADS, list);
    this.addNotification('info', `New Return Load ${loadId} posted for ${load.pickup} → ${load.destination}.`);
    return newLoad;
  }

  acceptLoad(loadId: string, truckId: string): { success: boolean; trip?: Trip; load?: ReturnLoad } {
    const loads = this.getLoads();
    const idx = loads.findIndex(l => l.loadId === loadId);
    if (idx === -1) return { success: false };

    const load = loads[idx];
    if (load.status !== 'Available') return { success: false };

    // Get selected truck and driver
    const trucks = this.getTrucks();
    const truck = trucks.find(t => t.truckId === truckId);
    const driverName = truck?.driver !== 'Unassigned' ? truck?.driver || 'Rahul Kumar' : 'Rahul Kumar';

    // 1. Mark load as Accepted
    load.status = 'Accepted';
    load.acceptedByTruck = truckId;
    load.acceptedAt = new Date().toISOString();
    loads[idx] = load;
    this.set(KEYS.LOADS, loads);

    // 2. Create trip automatically
    const newTrip = this.addTrip({
      truck: truckId,
      driver: driverName,
      origin: load.pickup,
      destination: load.destination,
      distance: load.distance,
      startTime: new Date().toISOString(),
      eta: new Date(Date.now() + (load.distance / 60) * 3600 * 1000).toISOString(),
      status: 'In Progress'
    });

    // 3. Create delivery record
    this.addDelivery({
      customer: load.shipperName,
      pickup: load.pickup,
      destination: load.destination,
      truck: truckId,
      driver: driverName,
      expectedDelivery: newTrip.eta
    });

    // 4. Send success notification
    this.addNotification(
      'success',
      `Return Load ${load.loadId} (${load.pickup} → ${load.destination}) ACCEPTED! Assigned to Truck ${truckId}. Estimated profit: ₹${load.estimatedProfit.toLocaleString()}.`
    );

    return { success: true, trip: newTrip, load };
  }

  // Documents
  getDocuments(): DigitalDocument[] {
    return this.get<DigitalDocument>(KEYS.DOCUMENTS, initialDocuments);
  }

  addDocument(doc: Omit<DigitalDocument, 'docId' | 'status' | 'uploadDate'>): DigitalDocument {
    const list = this.getDocuments();
    const docId = `DOC-${Math.floor(200 + Math.random() * 800)}`;
    const newDoc: DigitalDocument = {
      ...doc,
      docId,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    list.unshift(newDoc);
    this.set(KEYS.DOCUMENTS, list);
    this.addNotification('info', `Document "${doc.title}" uploaded for ${doc.entity} and is pending verification.`);
    return newDoc;
  }

  updateDocumentStatus(docId: string, status: DigitalDocument['status']): DigitalDocument | null {
    const list = this.getDocuments();
    const idx = list.findIndex(d => d.docId === docId);
    if (idx !== -1) {
      list[idx].status = status;
      this.set(KEYS.DOCUMENTS, list);
      this.addNotification('info', `Document ${docId} status updated to ${status}.`);
      return list[idx];
    }
    return null;
  }

  // Fuel
  getFuelMetrics(): FuelMetric[] {
    return this.get<FuelMetric>(KEYS.FUEL, initialFuelMetrics);
  }

  addFuelEntry(entry: { truckId: string; liters: number; cost: number; mileage: number; driver: string }): FuelMetric {
    const list = this.getFuelMetrics();
    const trucks = this.getTrucks();
    const truck = trucks.find(t => t.truckId === entry.truckId);
    const plateNumber = truck?.plateNumber || entry.truckId;

    const avgKmL = Number((entry.mileage / (entry.liters || 1)).toFixed(1));
    const baselineKmL = 4.8;
    const anomalyPercentage = Number((((baselineKmL - avgKmL) / baselineKmL) * 100).toFixed(1));
    const hasAnomaly = anomalyPercentage > 12;

    const newMetric: FuelMetric = {
      id: `FUEL-${Math.floor(200 + Math.random() * 800)}`,
      truckId: entry.truckId,
      plateNumber,
      driver: entry.driver,
      fuelConsumedLiters: entry.liters,
      fuelCost: entry.cost,
      avgKmL,
      baselineKmL,
      anomalyPercentage,
      hasAnomaly,
      anomalyReason: hasAnomaly ? `Fuel consumption ${anomalyPercentage}% above average baseline.` : undefined,
      lastRefillDate: new Date().toISOString().split('T')[0]
    };

    list.unshift(newMetric);
    this.set(KEYS.FUEL, list);

    // Also log expense
    this.addExpense({
      category: 'Fuel',
      amount: entry.cost,
      date: new Date().toISOString().split('T')[0],
      truck: entry.truckId,
      description: `Diesel refill ${entry.liters}L logged via Fuel Management`
    });

    this.addNotification('info', `Fuel refill logged for ${entry.truckId}: ${entry.liters}L (₹${entry.cost.toLocaleString()}).`);
    return newMetric;
  }

  // Maintenance
  getMaintenance(): MaintenanceRecord[] {
    return this.get<MaintenanceRecord>(KEYS.MAINTENANCE, initialMaintenance);
  }

  addMaintenance(record: Omit<MaintenanceRecord, 'id' | 'status'>): MaintenanceRecord {
    const list = this.getMaintenance();
    const id = `MNT-${Math.floor(400 + Math.random() * 600)}`;
    const newRecord: MaintenanceRecord = {
      ...record,
      id,
      status: 'Scheduled'
    };
    list.unshift(newRecord);
    this.set(KEYS.MAINTENANCE, list);
    this.updateTruck(record.truckId, { status: 'Maintenance' });
    this.addNotification('info', `Maintenance scheduled for Truck ${record.truckId}: ${record.serviceType}.`);
    return newRecord;
  }

  updateMaintenanceStatus(id: string, status: MaintenanceRecord['status']): MaintenanceRecord | null {
    const list = this.getMaintenance();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (status === 'Completed') {
        list[idx].completedDate = new Date().toISOString().split('T')[0];
        this.updateTruck(list[idx].truckId, { status: 'Available' });
      }
      this.set(KEYS.MAINTENANCE, list);
      return list[idx];
    }
    return null;
  }

  // Admin Verifications
  getTransporters(): TransporterVerification[] {
    return this.get<TransporterVerification>(KEYS.TRANSPORTERS, initialTransportersReq);
  }

  verifyTransporter(id: string, status: 'Verified' | 'Rejected'): TransporterVerification | null {
    const list = this.getTransporters();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      this.set(KEYS.TRANSPORTERS, list);
      this.addNotification('info', `Transporter ${list[idx].companyName} has been ${status}.`);
      return list[idx];
    }
    return null;
  }

  getShippers(): ShipperVerification[] {
    return this.get<ShipperVerification>(KEYS.SHIPPERS, initialShippersReq);
  }

  verifyShipper(id: string, status: 'Verified' | 'Rejected'): ShipperVerification | null {
    const list = this.getShippers();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      this.set(KEYS.SHIPPERS, list);
      this.addNotification('info', `Shipper ${list[idx].companyName} has been ${status}.`);
      return list[idx];
    }
    return null;
  }
}

export const localDB = new LocalDB();
export default localDB;
