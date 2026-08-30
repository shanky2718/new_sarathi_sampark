export interface IUser {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  passwordHash: string;
  role: string;
  companyName?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  fleetSize?: string;
  avatar?: string;
  onboarded: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
