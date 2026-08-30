export interface IDelivery {
  id: number;
  userId?: number;
  deliveryId: string;
  customer: string;
  pickup: string;
  destination: string;
  truck: string;
  driver: string;
  expectedDelivery: string;
  status: 'Order Confirmed' | 'Picked Up' | 'In Transit' | 'Near Destination' | 'Delivered';
}
