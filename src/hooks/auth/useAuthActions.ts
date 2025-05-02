
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from '@/types';

// Define a User type to fix the type error
type User = {
  id: string;
  email: string;
  role: UserRole;
  aud: string;
  created_at: string;
};

export const useAuthActions = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);

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
        } as User;
        
        // Simulate a session by storing the mock user in localStorage
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: {
            access_token: 'mock-token',
            user: mockUser
          }
        }));
        
        // Dispatch an auth state change event
        window.dispatchEvent(new Event('supabase.auth.token-change'));
        
        setIsLoading(false);
        return true;
      }
      
      // Real authentication for non-demo accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
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
      // For demo accounts, use mock authentication
      if (email.includes('@moveit.com')) {
        setIsLoading(false);
        return false; // Block registration with demo emails
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      setIsLoading(false);
      return !error;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Check if it's a demo account
    const authToken = localStorage.getItem('supabase.auth.token');
    if (authToken) {
      const parsedToken = JSON.parse(authToken);
      const user = parsedToken?.currentSession?.user;
      
      if (user?.email?.includes('@moveit.com')) {
        // Clear the mock session
        localStorage.removeItem('supabase.auth.token');
        window.dispatchEvent(new Event('supabase.auth.token-change'));
        return;
      }
    }
    
    // Regular logout for non-demo accounts
    supabase.auth.signOut();
  };

  return {
    login,
    loginWithGoogle,
    register,
    logout,
  };
};
