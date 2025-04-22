
// Ajout du type Profile
export interface Profile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

// Mise à jour du type UserRole
export type UserRole = 'user' | 'agent' | 'admin';
