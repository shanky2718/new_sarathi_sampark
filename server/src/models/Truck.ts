export interface ITruck {
  id: number;
  userId?: number;
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
  nextService?: string;
  insuranceExpiry?: string;
  fitnessExpiry?: string;
  pucExpiry?: string;
}
