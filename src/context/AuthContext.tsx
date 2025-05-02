
import { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthActions } from '@/hooks/auth/useAuthActions';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    profile, 
    userRole, 
    isLoading 
  } = useAuthState();
  
  const { 
    login, 
    loginWithGoogle, 
    register, 
    logout 
  } = useAuthActions(user?.id);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        userRole,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
