
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

export interface MoveRequest {
  id: string;
  user_id: string;
  agent_id?: string | null;
  status: "pending" | "approved" | "declined" | "completed";
  created_at?: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  moveDate: string;
  description: string;
  items: string[];
  requestType?: "residential" | "commercial" | "international";
}

export interface Message {
  id: string;
  request_id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_system?: boolean;
  profiles?: {
    full_name: string | null;
  } | null;
}
