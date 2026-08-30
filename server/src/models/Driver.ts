export interface IDriver {
  id: number;
  userId?: number;
  name: string;
  phone: string;
  photo?: string;
  assignedTruck: string;
  tripsCompleted: number;
  rating: number;
  safetyScore: number;
  licenseNumber: string;
  status: 'Active' | 'Inactive';
}
