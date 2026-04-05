
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types';
import { toast } from 'sonner';

// Demo accounts configuration
const DEMO_ACCOUNTS: Record<string, { password: string; role: UserRole; fullName: string }> = {
  'client@moveit.com': { password: 'demopass123', role: 'user', fullName: 'Client Démo' },
  'agent@moveit.com': { password: 'demopass123', role: 'agent', fullName: 'Agent Démo' },
  'moderator@moveit.com': { password: 'demopass123', role: 'moderator' as UserRole, fullName: 'Modérateur Démo' },
  'admin@moveit.com': { password: 'demopass123', role: 'admin', fullName: 'Admin Démo' },
};

const DEMO_USER_KEY = 'demo_user';

const createDemoUser = (email: string, config: typeof DEMO_ACCOUNTS[string]): User & { role?: UserRole } => ({
  id: `demo-${config.role}`,
  email,
  role: config.role,
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { full_name: config.fullName },
  identities: [],
  factors: [],
} as any);

const createDemoProfile = (email: string, config: typeof DEMO_ACCOUNTS[string]): Profile => ({
  id: `demo-${config.role}`,
  full_name: config.fullName,
  email,
  phone: '+229 00 000 000',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
} as Profile);

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<(User & { role?: UserRole }) | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer le profil et le rôle de l'utilisateur
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.warn('No role found for user, defaulting to user role');
      }

      setProfile(profileData);
      
      return {
        profile: profileData,
        role: roleData?.role || 'user'
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { profile: null, role: 'user' as UserRole };
    }
  };

  // Connexion
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Check for demo accounts first
      const demoConfig = DEMO_ACCOUNTS[email.toLowerCase()];
      if (demoConfig && password === demoConfig.password) {
        const demoUser = createDemoUser(email, demoConfig);
        const demoProfile = createDemoProfile(email, demoConfig);
        setUser(demoUser);
        setProfile(demoProfile);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify({ email, role: demoConfig.role }));
        toast.success('Connexion réussie (compte démo)');
        return true;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { profile, role } = await fetchUserProfile(data.user.id);
        setUser({ ...data.user, role });
        setProfile(profile);
        toast.success('Connexion réussie');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Créer le rôle par défaut
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'user'
        });

        toast.success('Inscription réussie');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const signOut = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      toast.success('Déconnexion réussie');
      return true;
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Erreur lors de la déconnexion');
      return false;
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (session?.user) {
          const { profile, role } = await fetchUserProfile(session.user.id);
          setUser({ ...session.user, role });
          setProfile(profile);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Vérifier la session initiale
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { profile, role } = await fetchUserProfile(session.user.id);
        setUser({ ...session.user, role });
        setProfile(profile);
      }
      
      setLoading(false);
    };

    getInitialSession();
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut
  };
};
