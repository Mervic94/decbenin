
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types';

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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from supabase table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
  
      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // Fetch role
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
  
      if (data && data.role) {
        setUserRole(data.role as UserRole);
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (session?.user) {
          fetchUserProfile(session.user.id);
          fetchUserRole(session.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchUserRole(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For demo accounts, use mock authentication
      if (
        (email === 'client@moveit.com' && password === 'demopass123') ||
        (email === 'agent@moveit.com' && password === 'demopass123') ||
        (email === 'moderator@moveit.com' && password === 'demopass123') ||
        (email === 'admin@moveit.com' && password === 'demopass123')
      ) {
        let mockRole: UserRole = "user";
        if (email.includes('admin')) mockRole = "admin";
        else if (email.includes('moderator')) mockRole = "moderator";
        else if (email.includes('agent')) mockRole = "agent";
        
        const mockId = email.includes('client') ? 'client-demo-id' : 
                      email.includes('agent') ? 'agent-demo-id' : 
                      email.includes('moderator') ? 'moderator-demo-id' : 'admin-demo-id';
        
        // Create mock user and profile
        const mockUser = {
          id: mockId,
          email: email,
          role: mockRole,
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as unknown as User;
        
        const mockProfile = {
          id: mockId,
          full_name: email.includes('client') ? 'Client Demo' : 
                    email.includes('agent') ? 'Agent Demo' : 
                    email.includes('moderator') ? 'Moderator Demo' : 'Admin Demo',
          created_at: new Date().toISOString()
        } as Profile;
        
        setUser(mockUser);
        setProfile(mockProfile);
        setUserRole(mockRole);
        
        setIsLoading(false);
        return true;
      }
      
      // Real authentication for non-demo accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (data?.user) {
        await fetchUserProfile(data.user.id);
        await fetchUserRole(data.user.id);
      }
      
      setIsLoading(false);
      return !error;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    setIsLoading(false);
    return !error;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (data?.user) {
        await fetchUserProfile(data.user.id);
        await fetchUserRole(data.user.id);
      }
      
      setIsLoading(false);
      return !error;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setUserRole(null);
  };

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
