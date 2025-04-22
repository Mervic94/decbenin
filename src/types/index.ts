
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

// Statut des demandes - Adding 'declined' to the possible statuses
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'declined' | 'completed';

// Demande de déménagement - Ensuring property names are consistent
export interface MoveRequest {
  id: string;
  user_id: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  moveDate: string; // Explicitly defining as string, not Date
  description: string;
  items: string[];
  status: RequestStatus;
  created_at?: string;
  updated_at?: string;
  approved_by?: string;
}
