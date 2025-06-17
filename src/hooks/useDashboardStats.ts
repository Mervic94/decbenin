
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  pending_requests: number;
  approved_requests: number;
  completed_requests: number;
  declined_requests: number;
  total_users: number;
  active_agents: number;
  last_updated: string;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard stats from materialized view...');
      
      // Utiliser la vue matérialisée pour des performances optimales
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }

      console.log('Dashboard stats fetched successfully:', data);
      setStats(data);
    } catch (err) {
      console.error('Error in fetchStats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      console.log('Refreshing materialized view...');
      
      // Rafraîchir la vue matérialisée
      const { error } = await supabase.rpc('refresh_dashboard_stats');
      
      if (error) {
        console.error('Error refreshing stats:', error);
        throw error;
      }

      console.log('Materialized view refreshed successfully');
      
      // Récupérer les nouvelles données
      await fetchStats();
    } catch (err) {
      console.error('Error in refreshStats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    refreshStats
  };
};
