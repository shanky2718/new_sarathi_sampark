'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import localDB from '@/lib/localDB';
import { 
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
} from '@/lib/localData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
}

interface DataContextType {
  trucks: Truck[];
  drivers: Driver[];
  trips: Trip[];
  deliveries: Delivery[];
  expenses: Expense[];
  notifications: Notification[];
  loads: ReturnLoad[];
  documents: DigitalDocument[];
  fuelMetrics: FuelMetric[];
  maintenance: MaintenanceRecord[];
  transporters: TransporterVerification[];
  shippers: ShipperVerification[];
  toasts: Toast[];
  
  refreshData: () => void;
  addTruck: (truck: any) => void;
  updateTruck: (id: string, updates: Partial<Truck>) => void;
  addDriver: (driver: any) => void;
  updateDriver: (name: string, updates: Partial<Driver>) => void;
  addTrip: (trip: any) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  addDelivery: (delivery: any) => void;
  updateDeliveryStatus: (id: string, status: Delivery['status']) => void;
  acceptReturnLoad: (loadId: string, truckId: string) => boolean;
  addReturnLoad: (load: any) => void;
  addDocument: (doc: any) => void;
  updateDocumentStatus: (id: string, status: DigitalDocument['status']) => void;
  addFuelEntry: (entry: any) => void;
  addMaintenance: (record: any) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceRecord['status']) => void;
  verifyTransporter: (id: string, status: 'Verified' | 'Rejected') => void;
  verifyShipper: (id: string, status: 'Verified' | 'Rejected') => void;
  addExpense: (expense: any) => void;
  markNotificationAsRead: (id: string) => void;
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loads, setLoads] = useState<ReturnLoad[]>([]);
  const [documents, setDocuments] = useState<DigitalDocument[]>([]);
  const [fuelMetrics, setFuelMetrics] = useState<FuelMetric[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [transporters, setTransporters] = useState<TransporterVerification[]>([]);
  const [shippers, setShippers] = useState<ShipperVerification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const refreshData = () => {
    setTrucks(localDB.getTrucks());
    setDrivers(localDB.getDrivers());
    setTrips(localDB.getTrips());
    setDeliveries(localDB.getDeliveries());
    setExpenses(localDB.getExpenses());
    setNotifications(localDB.getNotifications());
    setLoads(localDB.getLoads());
    setDocuments(localDB.getDocuments());
    setFuelMetrics(localDB.getFuelMetrics());
    setMaintenance(localDB.getMaintenance());
    setTransporters(localDB.getTransporters());
    setShippers(localDB.getShippers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addTruckHandler = (truck: any) => {
    localDB.addTruck(truck);
    refreshData();
    addToast('success', 'Truck Registered', `Truck ${truck.truckId} successfully added to fleet.`);
  };

  const updateTruckHandler = (id: string, updates: Partial<Truck>) => {
    localDB.updateTruck(id, updates);
    refreshData();
    addToast('info', 'Truck Updated', `Truck ${id} details updated.`);
  };

  const addDriverHandler = (driver: any) => {
    localDB.addDriver(driver);
    refreshData();
    addToast('success', 'Driver Added', `Driver ${driver.name} successfully registered.`);
  };

  const updateDriverHandler = (name: string, updates: Partial<Driver>) => {
    localDB.updateDriver(name, updates);
    refreshData();
    addToast('info', 'Driver Profile Updated', `Driver ${name} updated.`);
  };

  const addTripHandler = (trip: any) => {
    localDB.addTrip(trip);
    refreshData();
    addToast('success', 'Trip Created', `Trip scheduled for Truck ${trip.truck}.`);
  };

  const updateTripHandler = (id: string, updates: Partial<Trip>) => {
    localDB.updateTrip(id, updates);
    refreshData();
    addToast('info', 'Trip Status Updated', `Trip ${id} progress updated.`);
  };

  const addDeliveryHandler = (delivery: any) => {
    localDB.addDelivery(delivery);
    refreshData();
    addToast('success', 'Delivery Logged', `Delivery order created.`);
  };

  const updateDeliveryStatusHandler = (id: string, status: Delivery['status']) => {
    localDB.updateDelivery(id, status);
    refreshData();
    addToast('success', 'Delivery Updated', `Delivery ${id} is now ${status}.`);
  };

  const acceptReturnLoadHandler = (loadId: string, truckId: string): boolean => {
    const res = localDB.acceptLoad(loadId, truckId);
    if (res.success && res.load) {
      refreshData();
      addToast('success', 'Return Load Accepted!', `Load ${res.load.loadId} accepted.`);
      return true;
    }
    addToast('error', 'Acceptance Failed', 'Unable to accept return load.');
    return false;
  };

  const addReturnLoadHandler = (load: any) => {
    localDB.addLoad(load);
    refreshData();
    addToast('success', 'Load Posted', 'Return load published to marketplace.');
  };

  const addDocumentHandler = (doc: any) => {
    localDB.addDocument(doc);
    refreshData();
    addToast('success', 'Document Uploaded', `${doc.title} uploaded for verification.`);
  };

  const updateDocumentStatusHandler = (id: string, status: DigitalDocument['status']) => {
    localDB.updateDocumentStatus(id, status);
    refreshData();
    addToast('info', 'Document Verification Updated', `Document status changed to ${status}.`);
  };

  const addFuelEntryHandler = (entry: any) => {
    localDB.addFuelEntry(entry);
    refreshData();
    addToast('success', 'Fuel Logged', `Refill of ${entry.liters}L recorded.`);
  };

  const addMaintenanceHandler = (record: any) => {
    localDB.addMaintenance(record);
    refreshData();
    addToast('warning', 'Maintenance Logged', `Service scheduled for ${record.truckId}.`);
  };

  const updateMaintenanceStatusHandler = (id: string, status: MaintenanceRecord['status']) => {
    localDB.updateMaintenanceStatus(id, status);
    refreshData();
    addToast('info', 'Maintenance Updated', `Service status updated to ${status}.`);
  };

  const verifyTransporterHandler = (id: string, status: 'Verified' | 'Rejected') => {
    localDB.verifyTransporter(id, status);
    refreshData();
    addToast('info', 'Transporter Status Updated', `Transporter application ${status.toLowerCase()}.`);
  };

  const verifyShipperHandler = (id: string, status: 'Verified' | 'Rejected') => {
    localDB.verifyShipper(id, status);
    refreshData();
    addToast('info', 'Shipper Status Updated', `Shipper application ${status.toLowerCase()}.`);
  };

  const addExpenseHandler = (expense: any) => {
    localDB.addExpense(expense);
    refreshData();
    addToast('success', 'Expense Logged', `Expense of ₹${expense.amount} recorded.`);
  };

  const markNotificationAsReadHandler = (id: string) => {
    localDB.markNotificationAsRead(id);
    refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        trucks,
        drivers,
        trips,
        deliveries,
        expenses,
        notifications,
        loads,
        documents,
        fuelMetrics,
        maintenance,
        transporters,
        shippers,
        toasts,
        refreshData,
        addTruck: addTruckHandler,
        updateTruck: updateTruckHandler,
        addDriver: addDriverHandler,
        updateDriver: updateDriverHandler,
        addTrip: addTripHandler,
        updateTrip: updateTripHandler,
        addDelivery: addDeliveryHandler,
        updateDeliveryStatus: updateDeliveryStatusHandler,
        acceptReturnLoad: acceptReturnLoadHandler,
        addReturnLoad: addReturnLoadHandler,
        addDocument: addDocumentHandler,
        updateDocumentStatus: updateDocumentStatusHandler,
        addFuelEntry: addFuelEntryHandler,
        addMaintenance: addMaintenanceHandler,
        updateMaintenanceStatus: updateMaintenanceStatusHandler,
        verifyTransporter: verifyTransporterHandler,
        verifyShipper: verifyShipperHandler,
        addExpense: addExpenseHandler,
        markNotificationAsRead: markNotificationAsReadHandler,
        addToast,
        removeToast
      }}
    >
      {children}
      
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-xl border text-sm font-medium transition-all transform translate-y-0 ${
              toast.type === 'success' 
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700' 
                : toast.type === 'error' 
                ? 'bg-rose-900 text-rose-50 border-rose-700' 
                : toast.type === 'warning' 
                ? 'bg-amber-900 text-amber-50 border-amber-700' 
                : 'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            <div>
              <p className="font-bold text-base">{toast.title}</p>
              <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-70 hover:opacity-100 ml-4 font-mono font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
