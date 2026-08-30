export interface ITrip {
  id: number;
  userId?: number;
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
