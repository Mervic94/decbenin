
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoveRequest, Address, RequestStatus } from '@/types';
import { toast } from 'sonner';

export const useSupabaseRequests = () => {
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Récupérer toutes les demandes
  const fetchRequests = async () => {
    setLoading(true);
    try {
      console.log('Fetching requests from Supabase...');
      const { data, error } = await supabase
        .from('move_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching requests:', error);
        throw error;
      }
      
      console.log('Raw data from Supabase:', data);
      
      const formattedData: MoveRequest[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        agent_id: item.agent_id,
        status: item.status as RequestStatus,
        pickupAddress: item.pickup_address as unknown as Address,
        deliveryAddress: item.delivery_address as unknown as Address,
        moveDate: item.move_date,
        description: item.description || '',
        items: item.items || [],
        created_at: item.created_at,
        updated_at: item.updated_at,
        assigned_at: item.assigned_at,
        approved_by: item.approved_by
      }));
      
      console.log('Formatted requests:', formattedData);
      setRequests(formattedData);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast.error('Erreur lors du chargement des demandes: ' + (error.message || 'Erreur inconnue'));
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
      console.log('Creating new request...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        toast.error('Vous devez être connecté pour créer une demande');
        return false;
      }

      console.log('Authenticated user:', user.id);
      console.log('Request data:', { pickupAddress, deliveryAddress, moveDate, description, items });

      const { data, error } = await supabase
        .from('move_requests')
        .insert({
          user_id: user.id,
          pickup_address: pickupAddress as any,
          delivery_address: deliveryAddress as any,
          move_date: moveDate.toISOString().split('T')[0],
          description,
          items,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating request:', error);
        throw error;
      }
      
      console.log('Request created successfully:', data);
      toast.success('Demande créée avec succès');
      await fetchRequests();
      return true;
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast.error('Erreur lors de la création de la demande: ' + (error.message || 'Erreur inconnue'));
      return false;
    }
  };

  // Mettre à jour le statut d'une demande
  const updateRequestStatus = async (requestId: string, status: RequestStatus): Promise<boolean> => {
    try {
      console.log('Updating request status:', { requestId, status });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const { data, error } = await supabase
        .from('move_requests')
        .update({ 
          status,
          ...(status === 'approved' ? { approved_by: user.id } : {})
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating request status:', error);
        throw error;
      }
      
      console.log('Request status updated successfully:', data);
      toast.success(`Demande ${status === 'approved' ? 'approuvée' : status === 'declined' ? 'refusée' : 'mise à jour'} avec succès`);
      await fetchRequests();
      return true;
    } catch (error: any) {
      console.error('Error updating request status:', error);
      toast.error('Erreur lors de la mise à jour du statut: ' + (error.message || 'Erreur inconnue'));
      return false;
    }
  };

  // Assigner une demande à un agent
  const assignRequestToAgent = async (requestId: string, agentId?: string): Promise<boolean> => {
    try {
      console.log('Assigning request to agent:', { requestId, agentId });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const targetAgentId = agentId || user.id;
      console.log('Target agent ID:', targetAgentId);

      const { data, error } = await supabase
        .from('move_requests')
        .update({ 
          agent_id: targetAgentId,
          status: 'approved',
          assigned_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error assigning request:', error);
        throw error;
      }
      
      console.log('Request assigned successfully:', data);
      toast.success('Demande assignée avec succès');
      await fetchRequests();
      return true;
    } catch (error: any) {
      console.error('Error assigning request:', error);
      toast.error('Erreur lors de l\'assignation: ' + (error.message || 'Erreur inconnue'));
      return false;
    }
  };

  useEffect(() => {
    fetchRequests();

    // Écouter les changements en temps réel
    console.log('Setting up real-time subscription...');
    const channel = supabase
      .channel('move_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'move_requests'
        },
        (payload) => {
          console.log('Real-time change received:', payload);
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription...');
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
