
// Ajout du type Profile
export interface Profile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

// Mise à jour du type UserRole
export type UserRole = 'user' | 'agent' | 'admin';

// Adresse utilisée dans les demandes de déménagement
export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country?: string;
}

// Statut des demandes
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// Demande de déménagement
export interface MoveRequest {
  id: string;
  user_id: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  moveDate: string;
  description: string;
  items: string[];
  status: RequestStatus;
  created_at?: string;
}
