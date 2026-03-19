
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoveRequest, Address, RequestStatus } from '@/types';

export const useSupabaseRequests = () => {
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching requests from Supabase...');
      
      // Utilisation des nouveaux index pour des requêtes optimisées
      const { data, error } = await supabase
        .from('move_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }

      console.log('Requests fetched successfully:', data?.length || 0);
      const mapped = (data || []).map((row: any) => ({
        ...row,
        pickupAddress: row.pickup_address as Address,
        deliveryAddress: row.delivery_address as Address,
        moveDate: row.move_date,
      })) as MoveRequest[];
      setRequests(mapped);
    } catch (error) {
      console.error('Error in fetchRequests:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRequest = useCallback(async (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ): Promise<boolean> => {
    try {
      console.log('Creating request in Supabase...', { pickupAddress, deliveryAddress, moveDate, description, items });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const requestData = {
        user_id: user.id,
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        move_date: moveDate.toISOString().split('T')[0],
        description,
        items,
        status: 'pending' as RequestStatus
      };

      const { data, error } = await supabase
        .from('move_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) {
        console.error('Error creating request:', error);
        return false;
      }

      console.log('Request created successfully:', data);
      
      // Ajouter la nouvelle demande à la liste locale pour une mise à jour immédiate
      setRequests(prev => [data, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error in createRequest:', error);
      return false;
    }
  }, []);

  const updateRequestStatus = useCallback(async (requestId: string, status: RequestStatus): Promise<boolean> => {
    try {
      console.log('Updating request status in Supabase...', { requestId, status });
      
      const { error } = await supabase
        .from('move_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating request status:', error);
        return false;
      }

      console.log('Request status updated successfully');
      
      // Mettre à jour la liste locale
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status, updated_at: new Date().toISOString() }
          : request
      ));
      
      return true;
    } catch (error) {
      console.error('Error in updateRequestStatus:', error);
      return false;
    }
  }, []);

  const assignRequestToAgent = useCallback(async (requestId: string, agentId?: string): Promise<boolean> => {
    try {
      console.log('Assigning request to agent in Supabase...', { requestId, agentId });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const updateData = {
        agent_id: agentId || user.id,
        updated_at: new Date().toISOString(),
        assigned_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('move_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) {
        console.error('Error assigning request to agent:', error);
        return false;
      }

      console.log('Request assigned to agent successfully');
      
      // Mettre à jour la liste locale
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, ...updateData }
          : request
      ));
      
      return true;
    } catch (error) {
      console.error('Error in assignRequestToAgent:', error);
      return false;
    }
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
