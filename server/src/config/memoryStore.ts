import { 
  initialTrucks, 
  initialDrivers, 
  initialTrips, 
  initialDeliveries, 
  initialExpenses, 
  initialNotifications,
  MockTruck,
  MockDriver,
  MockTrip,
  MockDelivery,
  MockExpense,
  MockNotification
} from './mockData';

class MemoryStore {
  public users: any[] = [];
  public trucks: MockTruck[] = [...initialTrucks];
  public drivers: MockDriver[] = [...initialDrivers];
  public trips: MockTrip[] = [...initialTrips];
  public deliveries: MockDelivery[] = [...initialDeliveries];
  public expenses: MockExpense[] = [...initialExpenses];
  public notifications: MockNotification[] = [...initialNotifications];

  constructor() {
    console.log('📦 MemoryStore initialized with mock datasets.');
  }

  // Users
  findUserByEmail(email: string) {
    return this.users.find(u => u.email === email);
  }

  addUser(user: any) {
    const newUser = { ...user, _id: `usr_${Date.now()}` };
    this.users.push(newUser);
    return newUser;
  }

  updateUserOnboarded(email: string) {
    const user = this.findUserByEmail(email);
    if (user) {
      user.onboarded = true;
    }
    return user;
  }

  // Trucks
  getTrucks() {
    return this.trucks;
  }

  getTruckById(id: string) {
    return this.trucks.find(t => t.truckId === id);
  }

  addTruck(truck: any) {
    const newTruck = {
      ...truck,
      fuel: truck.fuel ?? 100,
      status: truck.status ?? 'Available',
      location: truck.location ?? 'Bengaluru',
      mileage: Number(truck.mileage) || 0
    };
    this.trucks.unshift(newTruck);
    return newTruck;
  }

  updateTruck(id: string, updates: Partial<MockTruck>) {
    const idx = this.trucks.findIndex(t => t.truckId === id);
    if (idx !== -1) {
      this.trucks[idx] = { ...this.trucks[idx], ...updates };
      return this.trucks[idx];
    }
    return null;
  }

  // Drivers
  getDrivers() {
    return this.drivers;
  }

  addDriver(driver: any) {
    const newDriver = {
      ...driver,
      tripsCompleted: 0,
      rating: 5.0,
      safetyScore: 95,
      status: 'Active'
    };
    this.drivers.unshift(newDriver);
    return newDriver;
  }

  updateDriver(name: string, updates: Partial<MockDriver>) {
    const idx = this.drivers.findIndex(d => d.name === name);
    if (idx !== -1) {
      this.drivers[idx] = { ...this.drivers[idx], ...updates };
      return this.drivers[idx];
    }
    return null;
  }

  // Trips
  getTrips() {
    return this.trips;
  }

  getTripById(id: string) {
    return this.trips.find(t => t.tripId === id);
  }

  addTrip(trip: any) {
    const newTrip = {
      ...trip,
      progress: 0,
      currentLatLng: { lat: 12.97, lng: 77.59 }, // Default to Bengaluru
      status: trip.status ?? 'Scheduled'
    };
    this.trips.unshift(newTrip);
    
    // Auto-update truck location and status
    this.updateTruck(trip.truck, { 
      status: trip.status === 'In Progress' ? 'Active' : 'Available',
      location: trip.origin,
      driver: trip.driver
    });

    return newTrip;
  }

  updateTrip(id: string, updates: Partial<MockTrip>) {
    const idx = this.trips.findIndex(t => t.tripId === id);
    if (idx !== -1) {
      this.trips[idx] = { ...this.trips[idx], ...updates };
      
      // If status changes, update truck status as well
      const trip = this.trips[idx];
      if (updates.status) {
        let truckStatus: 'Active' | 'Delayed' | 'Available' | 'Maintenance' = 'Available';
        if (updates.status === 'In Progress') truckStatus = 'Active';
        else if (updates.status === 'Delayed') truckStatus = 'Delayed';
        
        this.updateTruck(trip.truck, { 
          status: truckStatus,
          location: updates.progress === 100 ? trip.destination : trip.origin
        });
      }
      return this.trips[idx];
    }
    return null;
  }

  // Deliveries
  getDeliveries() {
    return this.deliveries;
  }

  addDelivery(delivery: any) {
    const newDelivery = {
      ...delivery,
      status: 'Order Confirmed'
    };
    this.deliveries.unshift(newDelivery);
    return newDelivery;
  }

  updateDelivery(id: string, status: MockDelivery['status']) {
    const idx = this.deliveries.findIndex(d => d.deliveryId === id);
    if (idx !== -1) {
      this.deliveries[idx].status = status;
      return this.deliveries[idx];
    }
    return null;
  }

  // Expenses
  getExpenses() {
    return this.expenses;
  }

  addExpense(expense: any) {
    const newExpense = {
      ...expense,
      expenseId: `EXP-${Date.now().toString().slice(-4)}`,
      amount: Number(expense.amount) || 0,
      date: expense.date ?? new Date().toISOString().split('T')[0]
    };
    this.expenses.unshift(newExpense);
    return newExpense;
  }

  // Notifications
  getNotifications() {
    return this.notifications;
  }

  markNotificationAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
    }
    return notif;
  }

  addNotification(type: 'warning' | 'info' | 'success', message: string) {
    const newNotif: MockNotification = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      type,
      message,
      time: 'Just now',
      read: false
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
