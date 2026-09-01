export interface Truck {
  truckId: string;
  plateNumber: string;
  model: string;
  type: string;
  capacity: string;
  driver: string;
  status: 'Active' | 'Delayed' | 'Maintenance' | 'Available';
  location: string;
  fuel: number;
  mileage: number;
  nextService: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  pucExpiry: string;
}

export interface Driver {
  name: string;
  phone: string;
  photo: string;
  assignedTruck: string;
  tripsCompleted: number;
  rating: number;
  safetyScore: number;
  licenseNumber: string;
  status: 'Active' | 'Inactive';
}

export interface Trip {
  tripId: string;
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  distance: number;
  startTime: string;
  eta: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed' | 'Cancelled';
  progress: number;
  currentLatLng: { lat: number; lng: number };
}

export interface Delivery {
  deliveryId: string;
  customer: string;
  pickup: string;
  destination: string;
  truck: string;
  driver: string;
  expectedDelivery: string;
  status: 'Order Confirmed' | 'Picked Up' | 'In Transit' | 'Near Destination' | 'Delivered';
}

export interface Expense {
  expenseId: string;
  category: 'Fuel' | 'Maintenance' | 'Toll' | 'Driver Expenses' | 'Insurance' | 'Other';
  amount: number;
  date: string;
  truck: string;
  description: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  time: string;
  read: boolean;
}

export interface ReturnLoad {
  loadId: string;
  pickup: string;
  destination: string;
  distance: number;
  cargo: string;
  weight: string;
  offeredPrice: number;
  estimatedFuelCost: number;
  estimatedProfit: number;
  verifiedShipper: boolean;
  shipperName: string;
  shipperRating: number;
  postedTime: string;
  status: 'Available' | 'Accepted' | 'Completed';
  pickupDate: string;
  requiredTruckType: string;
  acceptedByTruck?: string;
  acceptedAt?: string;
}

export interface DigitalDocument {
  docId: string;
  title: string;
  category: 'RC' | 'Insurance' | 'PUC' | 'Driving License' | 'GST Certificate' | 'Invoice' | 'E-Way Bill' | 'Permit';
  entity: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'Verified' | 'Pending' | 'Expiring Soon' | 'Expired';
  fileSize: string;
  documentNumber: string;
}

export interface FuelMetric {
  id: string;
  truckId: string;
  plateNumber: string;
  driver: string;
  fuelConsumedLiters: number;
  fuelCost: number;
  avgKmL: number;
  baselineKmL: number;
  anomalyPercentage: number;
  hasAnomaly: boolean;
  anomalyReason?: string;
  lastRefillDate: string;
}

export interface MaintenanceRecord {
  id: string;
  truckId: string;
  plateNumber: string;
  serviceType: string;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  mechanicCenter: string;
  notes: string;
}

export interface TransporterVerification {
  id: string;
  companyName: string;
  ownerName: string;
  gstNumber: string;
  truckCount: number;
  mobile: string;
  city: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedDate: string;
}

export interface ShipperVerification {
  id: string;
  companyName: string;
  contactPerson: string;
  gstNumber: string;
  loadsPosted: number;
  mobile: string;
  city: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedDate: string;
}

export const initialTrucks: Truck[] = [
  { truckId: 'TRK-101', plateNumber: 'KA-01-MJ-2034', model: 'Tata Prima 4930.S', type: 'Trailer', capacity: '40 Tons', driver: 'Rahul Kumar', status: 'Active', location: 'Bengaluru', fuel: 74, mileage: 42300, nextService: '2026-09-15', insuranceExpiry: '2027-02-14', fitnessExpiry: '2027-05-10', pucExpiry: '2026-12-05' },
  { truckId: 'TRK-102', plateNumber: 'MH-12-HQ-5678', model: 'Ashok Leyland Ecomet', type: 'Container', capacity: '15 Tons', driver: 'Vikram Singh', status: 'Available', location: 'Mumbai', fuel: 90, mileage: 65100, nextService: '2026-08-20', insuranceExpiry: '2026-08-25', fitnessExpiry: '2027-03-12', pucExpiry: '2026-09-18' },
  { truckId: 'TRK-103', plateNumber: 'DL-01-KA-1122', model: 'BharatBenz 3523R', type: 'Open Body', capacity: '25 Tons', driver: 'Sandeep Sharma', status: 'Active', location: 'Delhi', fuel: 45, mileage: 38200, nextService: '2026-10-05', insuranceExpiry: '2027-04-18', fitnessExpiry: '2027-06-20', pucExpiry: '2026-11-20' },
  { truckId: 'TRK-104', plateNumber: 'KA-03-PL-9081', model: 'Mahindra Blazo X', type: 'Trailer', capacity: '35 Tons', driver: 'Amit Patel', status: 'Delayed', location: 'Nellore', fuel: 32, mileage: 51200, nextService: '2026-08-16', insuranceExpiry: '2026-11-02', fitnessExpiry: '2027-01-15', pucExpiry: '2026-10-10' },
  { truckId: 'TRK-105', plateNumber: 'GJ-01-ZZ-9999', model: 'Tata Signa 2821.T', type: 'Container', capacity: '20 Tons', driver: 'Rajesh Varma', status: 'Maintenance', location: 'Ahmedabad', fuel: 15, mileage: 87400, nextService: '2026-08-09', insuranceExpiry: '2026-10-12', fitnessExpiry: '2026-12-25', pucExpiry: '2026-08-20' },
  { truckId: 'TRK-106', plateNumber: 'KA-04-ER-2345', model: 'BharatBenz 1914R', type: 'Box Body', capacity: '10 Tons', driver: 'Karan Singh', status: 'Available', location: 'Chennai', fuel: 85, mileage: 24500, nextService: '2026-11-10', insuranceExpiry: '2027-01-30', fitnessExpiry: '2027-08-14', pucExpiry: '2026-12-14' },
  { truckId: 'TRK-107', plateNumber: 'MH-14-TY-4532', model: 'Tata LPT 1916', type: 'Open Body', capacity: '12 Tons', driver: 'Manoj Yadav', status: 'Active', location: 'Pune', fuel: 58, mileage: 78900, nextService: '2026-09-02', insuranceExpiry: '2027-03-22', fitnessExpiry: '2027-04-10', pucExpiry: '2026-10-25' },
  { truckId: 'TRK-108', plateNumber: 'HR-55-AA-7654', model: 'Ashok Leyland U-4019', type: 'Trailer', capacity: '30 Tons', driver: 'Gopal Dutt', status: 'Active', location: 'Gurugram', fuel: 62, mileage: 92100, nextService: '2026-10-18', insuranceExpiry: '2026-09-30', fitnessExpiry: '2026-11-15', pucExpiry: '2026-09-01' },
  { truckId: 'TRK-109', plateNumber: 'KA-51-MM-8811', model: 'Eicher Pro 6028', type: 'Container', capacity: '22 Tons', driver: 'Sanjay Kumar', status: 'Available', location: 'Bengaluru', fuel: 95, mileage: 12000, nextService: '2026-12-01', insuranceExpiry: '2027-06-15', fitnessExpiry: '2027-09-20', pucExpiry: '2027-01-10' },
  { truckId: 'TRK-110', plateNumber: 'UP-16-BB-3245', model: 'Tata Signa 4825.T', type: 'Trailer', capacity: '45 Tons', driver: 'Vijay Prasad', status: 'Active', location: 'Noida', fuel: 50, mileage: 67300, nextService: '2026-09-28', insuranceExpiry: '2027-01-10', fitnessExpiry: '2027-05-18', pucExpiry: '2026-11-30' },
  { truckId: 'TRK-111', plateNumber: 'TS-09-UU-8765', model: 'Mahindra Furio 14', type: 'Box Body', capacity: '8 Tons', driver: 'Harish Rao', status: 'Active', location: 'Hyderabad', fuel: 40, mileage: 33400, nextService: '2026-09-12', insuranceExpiry: '2026-12-14', fitnessExpiry: '2027-02-10', pucExpiry: '2026-09-25' },
  { truckId: 'TRK-112', plateNumber: 'AP-16-ZZ-4321', model: 'BharatBenz 2823C', type: 'Dumper', capacity: '20 Tons', driver: 'Ravi Teja', status: 'Maintenance', location: 'Vijayawada', fuel: 10, mileage: 104500, nextService: '2026-08-10', insuranceExpiry: '2026-09-18', fitnessExpiry: '2026-10-30', pucExpiry: '2026-08-25' },
  { truckId: 'TRK-113', plateNumber: 'WB-23-CC-5432', model: 'Tata Ultra T.16', type: 'Container', capacity: '12 Tons', driver: 'Subrata Roy', status: 'Available', location: 'Kolkata', fuel: 82, mileage: 41200, nextService: '2026-10-30', insuranceExpiry: '2027-03-05', fitnessExpiry: '2027-05-12', pucExpiry: '2026-12-28' },
  { truckId: 'TRK-114', plateNumber: 'KA-05-NN-4390', model: 'Eicher Pro 3015', type: 'Open Body', capacity: '15 Tons', driver: 'Anil Kumar', status: 'Active', location: 'Hubballi', fuel: 68, mileage: 53100, nextService: '2026-09-10', insuranceExpiry: '2027-01-24', fitnessExpiry: '2027-04-16', pucExpiry: '2026-10-20' },
  { truckId: 'TRK-115', plateNumber: 'KL-07-BB-7722', model: 'Ashok Leyland Boss', type: 'Box Body', capacity: '9 Tons', driver: 'George Kutty', status: 'Active', location: 'Kochi', fuel: 70, mileage: 29800, nextService: '2026-09-24', insuranceExpiry: '2027-02-18', fitnessExpiry: '2027-04-22', pucExpiry: '2026-11-12' },
  { truckId: 'TRK-116', plateNumber: 'TN-07-DD-1290', model: 'Tata Signa 5530.S', type: 'Trailer', capacity: '50 Tons', driver: 'Mani Ratnam', status: 'Available', location: 'Chennai', fuel: 90, mileage: 72000, nextService: '2026-09-05', insuranceExpiry: '2026-11-30', fitnessExpiry: '2027-02-15', pucExpiry: '2026-09-30' },
  { truckId: 'TRK-117', plateNumber: 'MH-03-FF-3456', model: 'BharatBenz 1217C', type: 'Dumper', capacity: '10 Tons', driver: 'Dinesh Karthik', status: 'Active', location: 'Navi Mumbai', fuel: 48, mileage: 48500, nextService: '2026-10-12', insuranceExpiry: '2027-03-14', fitnessExpiry: '2027-07-28', pucExpiry: '2026-12-10' },
  { truckId: 'TRK-118', plateNumber: 'MP-09-GG-6789', model: 'Ashok Leyland 4220', type: 'Open Body', capacity: '30 Tons', driver: 'Ramesh Singh', status: 'Active', location: 'Indore', fuel: 55, mileage: 81300, nextService: '2026-09-18', insuranceExpiry: '2027-01-20', fitnessExpiry: '2027-03-30', pucExpiry: '2026-10-18' },
  { truckId: 'TRK-119', plateNumber: 'PB-02-AA-9876', model: 'Tata Prima 3530.K', type: 'Dumper', capacity: '25 Tons', driver: 'Gurpreet Singh', status: 'Maintenance', location: 'Ludhiana', fuel: 8, mileage: 112000, nextService: '2026-08-08', insuranceExpiry: '2026-09-10', fitnessExpiry: '2026-11-20', pucExpiry: '2026-08-15' },
  { truckId: 'TRK-120', plateNumber: 'KA-02-LL-1209', model: 'Mahindra Blazo X 28', type: 'Container', capacity: '20 Tons', driver: 'Unassigned', status: 'Available', location: 'Bengaluru', fuel: 100, mileage: 15400, nextService: '2026-11-22', insuranceExpiry: '2027-05-18', fitnessExpiry: '2027-08-25', pucExpiry: '2027-02-14' }
];

export const initialDrivers: Driver[] = [
  { name: 'Rahul Kumar', phone: '+91-9876543210', photo: '', assignedTruck: 'TRK-101', tripsCompleted: 45, rating: 4.8, safetyScore: 96, licenseNumber: 'DL-14201300984', status: 'Active' },
  { name: 'Vikram Singh', phone: '+91-9865432107', photo: '', assignedTruck: 'TRK-102', tripsCompleted: 38, rating: 4.6, safetyScore: 92, licenseNumber: 'MH-12201500741', status: 'Active' },
  { name: 'Sandeep Sharma', phone: '+91-9754321098', photo: '', assignedTruck: 'TRK-103', tripsCompleted: 52, rating: 4.9, safetyScore: 98, licenseNumber: 'DL-11201400258', status: 'Active' },
  { name: 'Amit Patel', phone: '+91-9643210987', photo: '', assignedTruck: 'TRK-104', tripsCompleted: 29, rating: 4.2, safetyScore: 85, licenseNumber: 'GJ-01201700369', status: 'Active' },
  { name: 'Rajesh Varma', phone: '+91-9532109876', photo: '', assignedTruck: 'TRK-105', tripsCompleted: 61, rating: 4.7, safetyScore: 94, licenseNumber: 'GJ-02201200147', status: 'Active' },
  { name: 'Karan Singh', phone: '+91-9421098765', photo: '', assignedTruck: 'TRK-106', tripsCompleted: 22, rating: 4.5, safetyScore: 91, licenseNumber: 'TN-07201800963', status: 'Active' },
  { name: 'Manoj Yadav', phone: '+91-9310987654', photo: '', assignedTruck: 'TRK-107', tripsCompleted: 40, rating: 4.4, safetyScore: 89, licenseNumber: 'UP-16201600852', status: 'Active' },
  { name: 'Gopal Dutt', phone: '+91-9209876543', photo: '', assignedTruck: 'TRK-108', tripsCompleted: 57, rating: 4.7, safetyScore: 95, licenseNumber: 'HR-55201300123', status: 'Active' },
  { name: 'Sanjay Kumar', phone: '+91-9198765432', photo: '', assignedTruck: 'TRK-109', tripsCompleted: 14, rating: 4.8, safetyScore: 97, licenseNumber: 'KA-01202000456', status: 'Active' },
  { name: 'Vijay Prasad', phone: '+91-9087654321', photo: '', assignedTruck: 'TRK-110', tripsCompleted: 33, rating: 4.3, safetyScore: 88, licenseNumber: 'UP-15201500789', status: 'Active' },
  { name: 'Harish Rao', phone: '+91-8976543210', photo: '', assignedTruck: 'TRK-111', tripsCompleted: 27, rating: 4.5, safetyScore: 90, licenseNumber: 'TS-09201700654', status: 'Active' },
  { name: 'Ravi Teja', phone: '+91-8865432109', photo: '', assignedTruck: 'TRK-112', tripsCompleted: 49, rating: 4.1, safetyScore: 82, licenseNumber: 'AP-16201400321', status: 'Active' },
  { name: 'Subrata Roy', phone: '+91-8754321098', photo: '', assignedTruck: 'TRK-113', tripsCompleted: 35, rating: 4.6, safetyScore: 93, licenseNumber: 'WB-23201500987', status: 'Active' },
  { name: 'Anil Kumar', phone: '+91-8643210987', photo: '', assignedTruck: 'TRK-114', tripsCompleted: 41, rating: 4.7, safetyScore: 94, licenseNumber: 'KA-05201600159', status: 'Active' },
  { name: 'George Kutty', phone: '+91-8532109876', photo: '', assignedTruck: 'TRK-115', tripsCompleted: 30, rating: 4.8, safetyScore: 96, licenseNumber: 'KL-07201800248', status: 'Active' }
];

export const initialTrips: Trip[] = [
  { tripId: 'TRP-501', truck: 'TRK-101', driver: 'Rahul Kumar', origin: 'Bengaluru', destination: 'Chennai', distance: 350, startTime: '2026-08-08T08:00:00Z', eta: '2026-08-08T16:00:00Z', status: 'In Progress', progress: 75, currentLatLng: { lat: 12.98, lng: 79.95 } },
  { tripId: 'TRP-502', truck: 'TRK-103', driver: 'Sandeep Sharma', origin: 'Delhi', destination: 'Jaipur', distance: 270, startTime: '2026-08-08T10:00:00Z', eta: '2026-08-08T15:30:00Z', status: 'In Progress', progress: 90, currentLatLng: { lat: 26.92, lng: 75.82 } },
  { tripId: 'TRP-503', truck: 'TRK-104', driver: 'Amit Patel', origin: 'Chennai', destination: 'Kolkata', distance: 1660, startTime: '2026-08-07T06:00:00Z', eta: '2026-08-09T18:00:00Z', status: 'Delayed', progress: 42, currentLatLng: { lat: 14.44, lng: 79.98 } },
  { tripId: 'TRP-504', truck: 'TRK-107', driver: 'Manoj Yadav', origin: 'Mumbai', destination: 'Pune', distance: 150, startTime: '2026-08-08T12:00:00Z', eta: '2026-08-08T15:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 18.52, lng: 73.85 } },
  { tripId: 'TRP-505', truck: 'TRK-108', driver: 'Gopal Dutt', origin: 'Gurugram', destination: 'Chandigarh', distance: 250, startTime: '2026-08-08T11:00:00Z', eta: '2026-08-08T16:30:00Z', status: 'In Progress', progress: 60, currentLatLng: { lat: 30.15, lng: 76.78 } },
  { tripId: 'TRP-506', truck: 'TRK-110', driver: 'Vijay Prasad', origin: 'Delhi', destination: 'Lucknow', distance: 550, startTime: '2026-08-08T07:00:00Z', eta: '2026-08-08T17:00:00Z', status: 'In Progress', progress: 80, currentLatLng: { lat: 26.85, lng: 80.94 } },
  { tripId: 'TRP-507', truck: 'TRK-111', driver: 'Harish Rao', origin: 'Hyderabad', destination: 'Vijayawada', distance: 275, startTime: '2026-08-08T13:00:00Z', eta: '2026-08-08T18:30:00Z', status: 'In Progress', progress: 30, currentLatLng: { lat: 17.20, lng: 79.15 } },
  { tripId: 'TRP-508', truck: 'TRK-114', driver: 'Anil Kumar', origin: 'Hubballi', destination: 'Bengaluru', distance: 410, startTime: '2026-08-08T09:00:00Z', eta: '2026-08-08T17:30:00Z', status: 'In Progress', progress: 85, currentLatLng: { lat: 13.34, lng: 77.10 } },
  { tripId: 'TRP-509', truck: 'TRK-115', driver: 'George Kutty', origin: 'Kochi', destination: 'Coimbatore', distance: 190, startTime: '2026-08-08T12:30:00Z', eta: '2026-08-08T16:30:00Z', status: 'In Progress', progress: 50, currentLatLng: { lat: 10.52, lng: 76.60 } },
  { tripId: 'TRP-510', truck: 'TRK-117', driver: 'Dinesh Karthik', origin: 'Mumbai', destination: 'Ahmedabad', distance: 530, startTime: '2026-08-08T05:00:00Z', eta: '2026-08-08T15:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 23.02, lng: 72.57 } }
];

export const initialDeliveries: Delivery[] = [
  { deliveryId: 'DLV-201', customer: 'Tata Steel Ltd', pickup: 'Jamshedpur', destination: 'Pune', truck: 'TRK-107', driver: 'Manoj Yadav', expectedDelivery: '2026-08-08T15:30:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-202', customer: 'UltraTech Cement', pickup: 'Bengaluru', destination: 'Chennai', truck: 'TRK-101', driver: 'Rahul Kumar', expectedDelivery: '2026-08-08T16:00:00Z', status: 'Near Destination' },
  { deliveryId: 'DLV-203', customer: 'Reliance Retail', pickup: 'Delhi', destination: 'Jaipur', truck: 'TRK-103', driver: 'Sandeep Sharma', expectedDelivery: '2026-08-08T15:30:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-204', customer: 'Amazon India', pickup: 'Chennai', destination: 'Kolkata', truck: 'TRK-104', driver: 'Amit Patel', expectedDelivery: '2026-08-09T18:00:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-205', customer: 'Ambuja Cements', pickup: 'Indore', destination: 'Bhopal', truck: 'TRK-118', driver: 'Ramesh Singh', expectedDelivery: '2026-08-08T18:00:00Z', status: 'Order Confirmed' }
];

export const initialExpenses: Expense[] = [
  { expenseId: 'EXP-101', category: 'Fuel', amount: 15400, date: '2026-08-08', truck: 'TRK-101', description: 'Diesel refill 200L - HP Station' },
  { expenseId: 'EXP-102', category: 'Toll', amount: 1250, date: '2026-08-08', truck: 'TRK-101', description: 'FASTag Toll charge NH4' },
  { expenseId: 'EXP-103', category: 'Maintenance', amount: 8500, date: '2026-08-07', truck: 'TRK-105', description: 'Engine oil and air filter change' }
];

export const initialNotifications: Notification[] = [
  { id: 'NOT-101', type: 'warning', message: 'Truck TRK-102 insurance expires in 17 days (2026-08-25).', time: '10 mins ago', read: false },
  { id: 'NOT-102', type: 'warning', message: 'Delivery #DLV-204 to Kolkata has been marked as delayed due to highway closure.', time: '1 hour ago', read: false },
  { id: 'NOT-103', type: 'success', message: 'Delivery #DLV-201 for Tata Steel Ltd completed successfully.', time: '4 hours ago', read: true }
];

export const initialReturnLoads: ReturnLoad[] = [
  { loadId: 'LOAD #SS-2048', pickup: 'Chennai', destination: 'Bengaluru', distance: 350, cargo: 'Industrial Equipment', weight: '8 Tons', offeredPrice: 18500, estimatedFuelCost: 6200, estimatedProfit: 12300, verifiedShipper: true, shipperName: 'L&T Heavy Engineering', shipperRating: 4.9, postedTime: '15 mins ago', status: 'Available', pickupDate: '2026-08-29', requiredTruckType: 'Container' },
  { loadId: 'LOAD #SS-2049', pickup: 'Mumbai', destination: 'Pune', distance: 150, cargo: 'Auto Components', weight: '12 Tons', offeredPrice: 14200, estimatedFuelCost: 3800, estimatedProfit: 10400, verifiedShipper: true, shipperName: 'Tata Motors Supply Chain', shipperRating: 4.8, postedTime: '42 mins ago', status: 'Available', pickupDate: '2026-08-29', requiredTruckType: 'Open Body' }
];

export const initialDocuments: DigitalDocument[] = [
  { docId: 'DOC-101', title: 'Registration Certificate (RC)', category: 'RC', entity: 'TRK-101 (KA-01-MJ-2034)', uploadDate: '2026-01-15', status: 'Verified', fileSize: '2.4 MB', documentNumber: 'RC-KA01MJ2034-2023' },
  { docId: 'DOC-102', title: 'Commercial Vehicle Insurance', category: 'Insurance', entity: 'TRK-102 (MH-12-HQ-5678)', uploadDate: '2025-08-26', expiryDate: '2026-08-25', status: 'Expiring Soon', fileSize: '1.8 MB', documentNumber: 'INS-MH12HQ5678-88' }
];

export const initialFuelMetrics: FuelMetric[] = [
  { id: 'FUEL-101', truckId: 'TRK-103', plateNumber: 'DL-01-KA-1122', driver: 'Sandeep Sharma', fuelConsumedLiters: 240, fuelCost: 22800, avgKmL: 3.9, baselineKmL: 4.8, anomalyPercentage: 18.7, hasAnomaly: true, anomalyReason: 'High idling time (4.2 hours) in heavy NCR traffic gridlock', lastRefillDate: '2026-08-28' }
];

export const initialMaintenance: MaintenanceRecord[] = [
  { id: 'MNT-301', truckId: 'TRK-105', plateNumber: 'GJ-01-ZZ-9999', serviceType: 'Full Engine Overhaul & Injector Cleaning', scheduledDate: '2026-08-25', status: 'In Progress', cost: 38500, mechanicCenter: 'Tata Motors Authorized Works - Ahmedabad', notes: 'Injectors undergoing pressure testing.' }
];

export const initialTransportersReq: TransporterVerification[] = [
  { id: 'TRN-801', companyName: 'VRL Logistics Partner Unit', ownerName: 'Srinivas Murthy', gstNumber: '29ABCDE1234F1ZH', truckCount: 14, mobile: '+91-9845011223', city: 'Hubballi', status: 'Pending', submittedDate: '2026-08-27' }
];

export const initialShippersReq: ShipperVerification[] = [
  { id: 'SHP-901', companyName: 'UltraTech Cement Dispatch Depot', contactPerson: 'Anand Kulkarni', gstNumber: '27AAACU1234F1Z8', loadsPosted: 34, mobile: '+91-9822055667', city: 'Nagpur', status: 'Verified', submittedDate: '2026-08-15' }
];
