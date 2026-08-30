export interface MockTruck {
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

export interface MockDriver {
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

export interface MockTrip {
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

export interface MockDelivery {
  deliveryId: string;
  customer: string;
  pickup: string;
  destination: string;
  truck: string;
  driver: string;
  expectedDelivery: string;
  status: 'Order Confirmed' | 'Picked Up' | 'In Transit' | 'Near Destination' | 'Delivered';
}

export interface MockExpense {
  expenseId: string;
  category: 'Fuel' | 'Maintenance' | 'Toll' | 'Driver Expenses' | 'Insurance' | 'Other';
  amount: number;
  date: string;
  truck: string;
  description: string;
}

export interface MockNotification {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  time: string;
  read: boolean;
}

// Pre-seeded lists containing 20 trucks, 15 drivers, 30 trips, 25 deliveries, expenses and notifications
export const initialTrucks: MockTruck[] = [
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

export const initialDrivers: MockDriver[] = [
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

export const initialTrips: MockTrip[] = [
  { tripId: 'TRP-501', truck: 'TRK-101', driver: 'Rahul Kumar', origin: 'Bengaluru', destination: 'Chennai', distance: 350, startTime: '2026-08-08T08:00:00Z', eta: '2026-08-08T16:00:00Z', status: 'In Progress', progress: 75, currentLatLng: { lat: 12.98, lng: 79.95 } },
  { tripId: 'TRP-502', truck: 'TRK-103', driver: 'Sandeep Sharma', origin: 'Delhi', destination: 'Jaipur', distance: 270, startTime: '2026-08-08T10:00:00Z', eta: '2026-08-08T15:30:00Z', status: 'In Progress', progress: 90, currentLatLng: { lat: 26.92, lng: 75.82 } },
  { tripId: 'TRP-503', truck: 'TRK-104', driver: 'Amit Patel', origin: 'Chennai', destination: 'Kolkata', distance: 1660, startTime: '2026-08-07T06:00:00Z', eta: '2026-08-09T18:00:00Z', status: 'Delayed', progress: 42, currentLatLng: { lat: 14.44, lng: 79.98 } }, // Nellore area
  { tripId: 'TRP-504', truck: 'TRK-107', driver: 'Manoj Yadav', origin: 'Mumbai', destination: 'Pune', distance: 150, startTime: '2026-08-08T12:00:00Z', eta: '2026-08-08T15:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 18.52, lng: 73.85 } },
  { tripId: 'TRP-505', truck: 'TRK-108', driver: 'Gopal Dutt', origin: 'Gurugram', destination: 'Chandigarh', distance: 250, startTime: '2026-08-08T11:00:00Z', eta: '2026-08-08T16:30:00Z', status: 'In Progress', progress: 60, currentLatLng: { lat: 30.15, lng: 76.78 } },
  { tripId: 'TRP-506', truck: 'TRK-110', driver: 'Vijay Prasad', origin: 'Delhi', destination: 'Lucknow', distance: 550, startTime: '2026-08-08T07:00:00Z', eta: '2026-08-08T17:00:00Z', status: 'In Progress', progress: 80, currentLatLng: { lat: 26.85, lng: 80.94 } },
  { tripId: 'TRP-507', truck: 'TRK-111', driver: 'Harish Rao', origin: 'Hyderabad', destination: 'Vijayawada', distance: 275, startTime: '2026-08-08T13:00:00Z', eta: '2026-08-08T18:30:00Z', status: 'In Progress', progress: 30, currentLatLng: { lat: 17.20, lng: 79.15 } },
  { tripId: 'TRP-508', truck: 'TRK-114', driver: 'Anil Kumar', origin: 'Hubballi', destination: 'Bengaluru', distance: 410, startTime: '2026-08-08T09:00:00Z', eta: '2026-08-08T17:30:00Z', status: 'In Progress', progress: 85, currentLatLng: { lat: 13.34, lng: 77.10 } },
  { tripId: 'TRP-509', truck: 'TRK-115', driver: 'George Kutty', origin: 'Kochi', destination: 'Coimbatore', distance: 190, startTime: '2026-08-08T12:30:00Z', eta: '2026-08-08T16:30:00Z', status: 'In Progress', progress: 50, currentLatLng: { lat: 10.52, lng: 76.60 } },
  { tripId: 'TRP-510', truck: 'TRK-117', driver: 'Dinesh Karthik', origin: 'Mumbai', destination: 'Ahmedabad', distance: 530, startTime: '2026-08-08T05:00:00Z', eta: '2026-08-08T15:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 23.02, lng: 72.57 } },
  { tripId: 'TRP-511', truck: 'TRK-118', driver: 'Ramesh Singh', origin: 'Indore', destination: 'Bhopal', distance: 195, startTime: '2026-08-08T14:00:00Z', eta: '2026-08-08T18:00:00Z', status: 'Scheduled', progress: 0, currentLatLng: { lat: 22.71, lng: 75.85 } },
  // Adding remaining 19 completed or scheduled trips to reach 30 trips total
  { tripId: 'TRP-512', truck: 'TRK-102', driver: 'Vikram Singh', origin: 'Pune', destination: 'Mumbai', distance: 150, startTime: '2026-08-07T08:00:00Z', eta: '2026-08-07T12:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 19.07, lng: 72.87 } },
  { tripId: 'TRP-513', truck: 'TRK-106', driver: 'Karan Singh', origin: 'Nellore', destination: 'Chennai', distance: 175, startTime: '2026-08-07T14:00:00Z', eta: '2026-08-07T18:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 13.08, lng: 80.27 } },
  { tripId: 'TRP-514', truck: 'TRK-109', driver: 'Sanjay Kumar', origin: 'Tumakuru', destination: 'Bengaluru', distance: 70, startTime: '2026-08-07T10:00:00Z', eta: '2026-08-07T11:45:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 12.97, lng: 77.59 } },
  { tripId: 'TRP-515', truck: 'TRK-113', driver: 'Subrata Roy', origin: 'Kharagpur', destination: 'Kolkata', distance: 140, startTime: '2026-08-07T15:00:00Z', eta: '2026-08-07T18:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 22.57, lng: 88.36 } },
  { tripId: 'TRP-516', truck: 'TRK-116', driver: 'Mani Ratnam', origin: 'Vellore', destination: 'Chennai', distance: 140, startTime: '2026-08-07T09:00:00Z', eta: '2026-08-07T12:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 13.08, lng: 80.27 } },
  { tripId: 'TRP-517', truck: 'TRK-101', driver: 'Rahul Kumar', origin: 'Chennai', destination: 'Bengaluru', distance: 350, startTime: '2026-08-06T09:00:00Z', eta: '2026-08-06T17:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 12.97, lng: 77.59 } },
  { tripId: 'TRP-518', truck: 'TRK-103', driver: 'Sandeep Sharma', origin: 'Jaipur', destination: 'Delhi', distance: 270, startTime: '2026-08-06T10:00:00Z', eta: '2026-08-06T15:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 28.61, lng: 77.20 } },
  { tripId: 'TRP-519', truck: 'TRK-108', driver: 'Gopal Dutt', origin: 'Chandigarh', destination: 'Gurugram', distance: 250, startTime: '2026-08-06T08:00:00Z', eta: '2026-08-06T13:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 28.45, lng: 77.02 } },
  { tripId: 'TRP-520', truck: 'TRK-110', driver: 'Vijay Prasad', origin: 'Lucknow', destination: 'Delhi', distance: 550, startTime: '2026-08-05T07:00:00Z', eta: '2026-08-05T17:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 28.61, lng: 77.20 } },
  { tripId: 'TRP-521', truck: 'TRK-111', driver: 'Harish Rao', origin: 'Vijayawada', destination: 'Hyderabad', distance: 275, startTime: '2026-08-05T12:00:00Z', eta: '2026-08-05T17:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 17.38, lng: 78.48 } },
  { tripId: 'TRP-522', truck: 'TRK-114', driver: 'Anil Kumar', origin: 'Bengaluru', destination: 'Hubballi', distance: 410, startTime: '2026-08-05T08:00:00Z', eta: '2026-08-05T16:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 15.36, lng: 75.12 } },
  { tripId: 'TRP-523', truck: 'TRK-115', driver: 'George Kutty', origin: 'Coimbatore', destination: 'Kochi', distance: 190, startTime: '2026-08-05T14:00:00Z', eta: '2026-08-05T18:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 9.93, lng: 76.26 } },
  { tripId: 'TRP-524', truck: 'TRK-117', driver: 'Dinesh Karthik', origin: 'Ahmedabad', destination: 'Mumbai', distance: 530, startTime: '2026-08-04T06:00:00Z', eta: '2026-08-04T16:00:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 19.07, lng: 72.87 } },
  { tripId: 'TRP-525', truck: 'TRK-105', driver: 'Rajesh Varma', origin: 'Vadodara', destination: 'Ahmedabad', distance: 110, startTime: '2026-08-08T09:00:00Z', eta: '2026-08-08T11:30:00Z', status: 'Completed', progress: 100, currentLatLng: { lat: 23.02, lng: 72.57 } },
  { tripId: 'TRP-526', truck: 'TRK-102', driver: 'Vikram Singh', origin: 'Mumbai', destination: 'Nashik', distance: 165, startTime: '2026-08-09T08:00:00Z', eta: '2026-08-09T12:00:00Z', status: 'Scheduled', progress: 0, currentLatLng: { lat: 19.07, lng: 72.87 } },
  { tripId: 'TRP-527', truck: 'TRK-106', driver: 'Karan Singh', origin: 'Chennai', destination: 'Puducherry', distance: 150, startTime: '2026-08-09T10:00:00Z', eta: '2026-08-09T13:30:00Z', status: 'Scheduled', progress: 0, currentLatLng: { lat: 13.08, lng: 80.27 } },
  { tripId: 'TRP-528', truck: 'TRK-109', driver: 'Sanjay Kumar', origin: 'Bengaluru', destination: 'Mysuru', distance: 140, startTime: '2026-08-09T07:00:00Z', eta: '2026-08-09T10:30:00Z', status: 'Scheduled', progress: 0, currentLatLng: { lat: 12.97, lng: 77.59 } },
  { tripId: 'TRP-529', truck: 'TRK-113', driver: 'Subrata Roy', origin: 'Kolkata', destination: 'Haldia', distance: 120, startTime: '2026-08-09T09:00:00Z', eta: '2026-08-09T12:30:00Z', status: 'Scheduled', progress: 0, currentLatLng: { lat: 22.57, lng: 88.36 } },
  { tripId: 'TRP-530', truck: 'TRK-101', driver: 'Rahul Kumar', origin: 'Bengaluru', destination: 'Mangaluru', distance: 350, startTime: '2026-08-10T06:00:00Z', eta: '2026-08-10T14:30:00Z', status: 'Scheduled', progress: 0, currentLatLng: { lat: 12.97, lng: 77.59 } }
];

export const initialDeliveries: MockDelivery[] = [
  { deliveryId: 'DLV-201', customer: 'Tata Steel Ltd', pickup: 'Jamshedpur', destination: 'Pune', truck: 'TRK-107', driver: 'Manoj Yadav', expectedDelivery: '2026-08-08T15:30:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-202', customer: 'UltraTech Cement', pickup: 'Bengaluru', destination: 'Chennai', truck: 'TRK-101', driver: 'Rahul Kumar', expectedDelivery: '2026-08-08T16:00:00Z', status: 'Near Destination' },
  { deliveryId: 'DLV-203', customer: 'Reliance Retail', pickup: 'Delhi', destination: 'Jaipur', truck: 'TRK-103', driver: 'Sandeep Sharma', expectedDelivery: '2026-08-08T15:30:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-204', customer: 'Amazon India', pickup: 'Chennai', destination: 'Kolkata', truck: 'TRK-104', driver: 'Amit Patel', expectedDelivery: '2026-08-09T18:00:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-205', customer: 'Ambuja Cements', pickup: 'Indore', destination: 'Bhopal', truck: 'TRK-118', driver: 'Ramesh Singh', expectedDelivery: '2026-08-08T18:00:00Z', status: 'Order Confirmed' },
  { deliveryId: 'DLV-206', customer: 'DHL Express', pickup: 'Gurugram', destination: 'Chandigarh', truck: 'TRK-108', driver: 'Gopal Dutt', expectedDelivery: '2026-08-08T16:30:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-207', customer: 'JSW Steel', pickup: 'Delhi', destination: 'Lucknow', truck: 'TRK-110', driver: 'Vijay Prasad', expectedDelivery: '2026-08-08T17:00:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-208', customer: 'Flipkart Logistics', pickup: 'Hyderabad', destination: 'Vijayawada', truck: 'TRK-111', driver: 'Harish Rao', expectedDelivery: '2026-08-08T18:30:00Z', status: 'Picked Up' },
  { deliveryId: 'DLV-209', customer: 'MRF Tyres Ltd', pickup: 'Hubballi', destination: 'Bengaluru', truck: 'TRK-114', driver: 'Anil Kumar', expectedDelivery: '2026-08-08T17:30:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-210', customer: 'ITC Limited', pickup: 'Kochi', destination: 'Coimbatore', truck: 'TRK-115', driver: 'George Kutty', expectedDelivery: '2026-08-08T16:30:00Z', status: 'In Transit' },
  { deliveryId: 'DLV-211', customer: 'Hindustan Unilever', pickup: 'Mumbai', destination: 'Ahmedabad', truck: 'TRK-117', driver: 'Dinesh Karthik', expectedDelivery: '2026-08-08T15:00:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-212', customer: 'L&T Construction', pickup: 'Mumbai', destination: 'Nashik', truck: 'TRK-102', driver: 'Vikram Singh', expectedDelivery: '2026-08-09T12:00:00Z', status: 'Order Confirmed' },
  { deliveryId: 'DLV-213', customer: 'TVS Motors', pickup: 'Chennai', destination: 'Puducherry', truck: 'TRK-106', driver: 'Karan Singh', expectedDelivery: '2026-08-09T13:30:00Z', status: 'Order Confirmed' },
  { deliveryId: 'DLV-214', customer: 'Britannia Industries', pickup: 'Bengaluru', destination: 'Mysuru', truck: 'TRK-109', driver: 'Sanjay Kumar', expectedDelivery: '2026-08-09T10:30:00Z', status: 'Order Confirmed' },
  { deliveryId: 'DLV-215', customer: 'Vedanta Ltd', pickup: 'Kolkata', destination: 'Haldia', truck: 'TRK-113', driver: 'Subrata Roy', expectedDelivery: '2026-08-09T12:30:00Z', status: 'Order Confirmed' },
  // Adding remaining 10 deliveries to reach 25 deliveries total
  { deliveryId: 'DLV-216', customer: 'Apollo Tyres', pickup: 'Vadodara', destination: 'Ahmedabad', truck: 'TRK-105', driver: 'Rajesh Varma', expectedDelivery: '2026-08-08T11:30:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-217', customer: 'Adani Wilmar', pickup: 'Kharagpur', destination: 'Kolkata', truck: 'TRK-113', driver: 'Subrata Roy', expectedDelivery: '2026-08-07T18:30:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-218', customer: 'Honda Cars India', pickup: 'Vellore', destination: 'Chennai', truck: 'TRK-116', driver: 'Mani Ratnam', expectedDelivery: '2026-08-07T12:00:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-219', customer: 'Nestle India', pickup: 'Tumakuru', destination: 'Bengaluru', truck: 'TRK-109', driver: 'Sanjay Kumar', expectedDelivery: '2026-08-07T11:45:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-220', customer: 'Cipla Pharma', pickup: 'Nellore', destination: 'Chennai', truck: 'TRK-106', driver: 'Karan Singh', expectedDelivery: '2026-08-07T18:00:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-221', customer: 'PepsiCo India', pickup: 'Pune', destination: 'Mumbai', truck: 'TRK-102', driver: 'Vikram Singh', expectedDelivery: '2026-08-07T12:00:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-222', customer: 'Dr. Reddys Labs', pickup: 'Vijayawada', destination: 'Hyderabad', truck: 'TRK-111', driver: 'Harish Rao', expectedDelivery: '2026-08-05T17:30:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-223', customer: 'Shree Cement', pickup: 'Jaipur', destination: 'Delhi', truck: 'TRK-103', driver: 'Sandeep Sharma', expectedDelivery: '2026-08-06T15:30:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-224', customer: 'Colgate Palmolive', pickup: 'Coimbatore', destination: 'Kochi', truck: 'TRK-115', driver: 'George Kutty', expectedDelivery: '2026-08-05T18:00:00Z', status: 'Delivered' },
  { deliveryId: 'DLV-225', customer: 'Maruti Suzuki', pickup: 'Gurugram', destination: 'Chandigarh', truck: 'TRK-108', driver: 'Gopal Dutt', expectedDelivery: '2026-08-06T13:30:00Z', status: 'Delivered' }
];

export const initialExpenses: MockExpense[] = [
  { expenseId: 'EXP-101', category: 'Fuel', amount: 15400, date: '2026-08-08', truck: 'TRK-101', description: 'Diesel refill 200L - HP Station' },
  { expenseId: 'EXP-102', category: 'Toll', amount: 1250, date: '2026-08-08', truck: 'TRK-101', description: 'FASTag Toll charge NH4' },
  { expenseId: 'EXP-103', category: 'Maintenance', amount: 8500, date: '2026-08-07', truck: 'TRK-105', description: 'Engine oil and air filter change' },
  { expenseId: 'EXP-104', category: 'Driver Expenses', amount: 3500, date: '2026-08-07', truck: 'TRK-104', description: 'Driver overnight allowance + meals' },
  { expenseId: 'EXP-105', category: 'Insurance', amount: 45000, date: '2026-08-05', truck: 'TRK-102', description: 'Annual commercial insurance premium renewal' },
  { expenseId: 'EXP-106', category: 'Fuel', amount: 18200, date: '2026-08-08', truck: 'TRK-103', description: 'Diesel refill 240L - IndianOil' },
  { expenseId: 'EXP-107', category: 'Toll', amount: 2450, date: '2026-08-08', truck: 'TRK-103', description: 'FASTag toll NH8' },
  { expenseId: 'EXP-108', category: 'Maintenance', amount: 12500, date: '2026-08-06', truck: 'TRK-112', description: 'Brake pad replacement and brake bleeding' },
  { expenseId: 'EXP-109', category: 'Driver Expenses', amount: 1500, date: '2026-08-08', truck: 'TRK-110', description: 'Driver trip allowance' },
  { expenseId: 'EXP-110', category: 'Fuel', amount: 14800, date: '2026-08-08', truck: 'TRK-114', description: 'Diesel refill 190L' },
  { expenseId: 'EXP-111', category: 'Toll', amount: 950, date: '2026-08-08', truck: 'TRK-114', description: 'Toll plaza charges' },
  { expenseId: 'EXP-112', category: 'Other', amount: 500, date: '2026-08-08', truck: 'TRK-108', description: 'State permit entry fee' },
  { expenseId: 'EXP-113', category: 'Fuel', amount: 22000, date: '2026-08-07', truck: 'TRK-108', description: 'Diesel refill 280L' },
  { expenseId: 'EXP-114', category: 'Maintenance', amount: 24000, date: '2026-08-05', truck: 'TRK-119', description: 'Front tyre replacement (2 tyres)' },
  { expenseId: 'EXP-115', category: 'Driver Expenses', amount: 4500, date: '2026-08-06', truck: 'TRK-108', description: 'Driver incentive for on-time delivery' }
];

export const initialNotifications: MockNotification[] = [
  { id: 'NOT-101', type: 'warning', message: 'Truck TRK-102 insurance expires in 17 days (2026-08-25).', time: '10 mins ago', read: false },
  { id: 'NOT-102', type: 'warning', message: 'Delivery #DLV-204 to Kolkata has been marked as delayed due to highway closure.', time: '1 hour ago', read: false },
  { id: 'NOT-103', type: 'success', message: 'Delivery #DLV-201 for Tata Steel Ltd completed successfully.', time: '4 hours ago', read: true },
  { id: 'NOT-104', type: 'info', message: 'Maintenance schedule created for TRK-105. Service date: 2026-08-09.', time: '1 day ago', read: true },
  { id: 'NOT-105', type: 'warning', message: 'Truck TRK-119 is overdue for engine maintenance.', time: '2 days ago', read: true }
];
