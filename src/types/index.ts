
// types/index.ts
export type UserRole = "user" | "agent" | "moderator" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export type RequestStatus = "pending" | "approved" | "declined" | "completed";

export interface MoveRequest {
  id: string;
  user_id: string;
  agent_id?: string | null;
  status: RequestStatus;
  created_at?: string;
  updated_at?: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  moveDate: string;
  description: string;
  items: string[];
  requestType?: "residential" | "commercial" | "international";
  // Add the missing properties that are being used in the codebase
  assigned_at?: string;
  approved_by?: string;
}

export interface Message {
  id: string;
  request_id: string;
  user_id: string;
  sender_id?: string;
  recipient_id?: string;
  content: string;
  created_at: string;
  is_system?: boolean;
  read?: boolean;
  profiles?: {
    full_name: string | null;
  } | null;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  read: boolean;
  // Add the missing properties that are being used in the codebase
  title?: string;
  content?: string;
  type?: string;
  reference_id?: string;
}

// Define QuoteRequest interface for the profile page
export interface QuoteRequest {
  id: string;
  reference: string;
  created_at: string;
  move_date: string;
  status: 'pending' | 'completed';
  volume: number;
  pickup_address: string;
  delivery_address: string;
  pickup_coordinates: {
    latitude: number;
    longitude: number;
  };
  delivery_coordinates: {
    latitude: number;
    longitude: number;
  };
}
