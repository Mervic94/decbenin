
export type UserRole = 'user' | 'agent' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export type RequestStatus = 'pending' | 'approved' | 'declined' | 'completed';

export interface MoveRequest {
  id: string;
  userId: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  moveDate: Date;
  description: string;
  items: string[];
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
}
