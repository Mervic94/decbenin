import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { Profile, UserRole } from '@/types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from supabase table
  const fetchUserProfile = async (userId: string) => {
    try {
      // For demo accounts, create mock profiles
      if (userId.includes('demo-id')) {
        const mockProfile: Profile = {
          id: userId,
          full_name: userId.includes('client') ? 'Client Demo' :
                    userId.includes('agent') ? 'Agent Demo' :
                    userId.includes('moderator') ? 'Moderateur Demo' : 'Admin Demo',
          created_at: new Date().toISOString()
        };
        setProfile(mockProfile);
        return;
      }
      
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
      // For demo accounts, use the role from the user ID
      if (userId.includes('demo-id')) {
        const role: UserRole = userId.includes('client') ? 'user' :
                              userId.includes('agent') ? 'agent' :
                              userId.includes('moderator') ? 'moderator' : 'admin';
        setUserRole(role);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
  
      if (data && data.role) {
        setUserRole(data.role as UserRole);
      } else {
        setUserRole('user'); // Default role
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user'); // Default to user role on error
    }
  };

  useEffect(() => {
    // Check for demo user in localStorage
    const checkForDemoUser = () => {
      try {
        const authToken = localStorage.getItem('supabase.auth.token');
        if (authToken) {
          const parsedToken = JSON.parse(authToken);
          const demoUser = parsedToken?.currentSession?.user;
          
          if (demoUser && demoUser.email?.includes('@moveit.com')) {
            setUser(demoUser as User);
            fetchUserProfile(demoUser.id);
            fetchUserRole(demoUser.id);
            setIsLoading(false);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Error checking for demo user:', error);
        return false;
      }
    };

    // Handle auth state change
    const handleAuthChange = (event: string, session: any) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchUserRole(session.user.id);
      } else {
        // Check if it's a demo user even when session is null
        if (!checkForDemoUser()) {
          setProfile(null);
          setUserRole(null);
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check for existing session on mount
    const initializeAuth = async () => {
      // Check for demo user first
      if (checkForDemoUser()) {
        return;
      }
      
      // Otherwise check for real session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchUserRole(session.user.id);
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for manual demo auth changes
    const handleTokenChange = () => {
      checkForDemoUser();
    };
    
    window.addEventListener('supabase.auth.token-change', handleTokenChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('supabase.auth.token-change', handleTokenChange);
    };
  }, []);

  return {
    user,
    profile,
    userRole,
    isLoading
  };
};
