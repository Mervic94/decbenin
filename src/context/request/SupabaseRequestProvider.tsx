
import { useState, ReactNode, useEffect } from 'react';
import { MoveRequest, Address, RequestStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useSupabaseRequests } from '@/hooks/useSupabaseRequests';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import RequestContext from './RequestContext';

interface SupabaseRequestProviderProps {
  children: ReactNode;
}

export const SupabaseRequestProvider = ({ children }: SupabaseRequestProviderProps) => {
  const { user } = useAuth();
  const { 
    requests, 
    loading, 
    fetchRequests, 
    createRequest: createSupabaseRequest, 
    updateRequestStatus: updateSupabaseStatus, 
    assignRequestToAgent: assignSupabaseRequest 
  } = useSupabaseRequests();
  
  const { createNotification } = useSupabaseNotifications();

  // Wrapper functions pour correspondre à l'interface RequestContext
  const createRequest = async (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ): Promise<boolean> => {
    try {
      console.log('Creating request with:', { pickupAddress, deliveryAddress, moveDate, description, items });
      const success = await createSupabaseRequest(pickupAddress, deliveryAddress, moveDate, description, items);
      
      if (success && user) {
        // Créer une notification pour l'utilisateur
        await createNotification(
          user.id,
          'Demande créée',
          'Votre demande de déménagement a été créée avec succès',
          'request_created'
        );
        console.log('Request created successfully and notification sent');
      }
      
      return success;
    } catch (error) {
      console.error('Error in createRequest wrapper:', error);
      return false;
    }
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus): Promise<boolean> => {
    try {
      console.log('Updating request status:', { requestId, status });
      const success = await updateSupabaseStatus(requestId, status);
      
      if (success) {
        // Trouver la demande pour notifier l'utilisateur
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const statusMessages = {
            approved: 'approuvée',
            declined: 'refusée', 
            completed: 'terminée',
            pending: 'en attente'
          };
          
          await createNotification(
            request.user_id,
            'Statut mis à jour',
            `Votre demande est maintenant ${statusMessages[status]}`,
            'status_update',
            requestId
          );
          console.log('Request status updated and notification sent');
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error in updateRequestStatus wrapper:', error);
      return false;
    }
  };

  const assignRequestToAgent = async (requestId: string, agentId?: string): Promise<boolean> => {
    try {
      console.log('Assigning request to agent:', { requestId, agentId });
      const success = await assignSupabaseRequest(requestId, agentId);
      
      if (success) {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          await createNotification(
            request.user_id,
            'Agent assigné',
            'Un agent a été assigné à votre demande de déménagement',
            'agent_assigned',
            requestId
          );
          console.log('Request assigned to agent and notification sent');
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error in assignRequestToAgent wrapper:', error);
      return false;
    }
  };

  const transferRequestToAgent = async (requestId: string, agentId: string): Promise<boolean> => {
    try {
      console.log('Transferring request to agent:', { requestId, agentId });
      return await assignSupabaseRequest(requestId, agentId);
    } catch (error) {
      console.error('Error in transferRequestToAgent wrapper:', error);
      return false;
    }
  };

  // Filtrer les demandes selon le rôle et l'utilisateur
  const getUserRequests = (): MoveRequest[] => {
    if (!user) {
      console.log('No user found, returning empty requests');
      return [];
    }
    const userRequests = requests.filter(request => request.user_id === user.id);
    console.log('User requests found:', userRequests.length);
    return userRequests;
  };

  const getPendingRequests = (): MoveRequest[] => {
    if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
      console.log('User not authorized to view pending requests');
      return [];
    }
    const pendingRequests = requests.filter(request => request.status === 'pending' && !request.agent_id);
    console.log('Pending requests found:', pendingRequests.length);
    return pendingRequests;
  };

  const getAssignedRequests = (): MoveRequest[] => {
    if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
      console.log('User not authorized to view assigned requests');
      return [];
    }
    const assignedRequests = requests.filter(request => 
      request.agent_id === user.id || 
      (user.role === 'admin' && request.agent_id)
    );
    console.log('Assigned requests found:', assignedRequests.length);
    return assignedRequests;
  };

  const refreshRequests = async () => {
    try {
      console.log('Refreshing requests...');
      await fetchRequests();
      console.log('Requests refreshed successfully');
    } catch (error) {
      console.error('Error refreshing requests:', error);
    }
  };

  // Charger les demandes au montage du composant si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching requests...');
      refreshRequests();
    }
  }, [user]);

  return (
    <RequestContext.Provider
      value={{
        requests,
        createRequest,
        getUserRequests,
        getPendingRequests,
        getAssignedRequests,
        updateRequestStatus,
        assignRequestToAgent,
        transferRequestToAgent,
        refreshRequests,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
