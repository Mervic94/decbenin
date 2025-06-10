
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoveRequest, Address } from '@/types';
import { toast } from 'sonner';

export const useSupabaseRequests = () => {
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Récupérer toutes les demandes
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('move_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData: MoveRequest[] = data.map(item => ({
        ...item,
        pickupAddress: item.pickup_address as Address,
        deliveryAddress: item.delivery_address as Address,
        moveDate: item.move_date,
        items: item.items || []
      }));
      
      setRequests(formattedData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle demande
  const createRequest = async (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour créer une demande');
        return false;
      }

      const { error } = await supabase
        .from('move_requests')
        .insert({
          user_id: user.id,
          pickup_address: pickupAddress,
          delivery_address: deliveryAddress,
          move_date: moveDate.toISOString().split('T')[0],
          description,
          items,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('Demande créée avec succès');
      await fetchRequests();
      return true;
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Erreur lors de la création de la demande');
      return false;
    }
  };

  // Mettre à jour le statut d'une demande
  const updateRequestStatus = async (requestId: string, status: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('move_requests')
        .update({ 
          status,
          ...(status === 'approved' ? { approved_by: user.id } : {})
        })
        .eq('id', requestId);

      if (error) throw error;
      
      await fetchRequests();
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      return false;
    }
  };

  // Assigner une demande à un agent
  const assignRequestToAgent = async (requestId: string, agentId?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const targetAgentId = agentId || user.id;

      const { error } = await supabase
        .from('move_requests')
        .update({ 
          agent_id: targetAgentId,
          status: 'approved',
          assigned_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      
      await fetchRequests();
      return true;
    } catch (error) {
      console.error('Error assigning request:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRequests();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('move_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'move_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    requests,
    loading,
    fetchRequests,
    createRequest,
    updateRequestStatus,
    assignRequestToAgent
  };
};
