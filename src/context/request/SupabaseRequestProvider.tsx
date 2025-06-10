
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
    createRequest as createSupabaseRequest, 
    updateRequestStatus as updateSupabaseStatus, 
    assignRequestToAgent as assignSupabaseRequest 
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
    const success = await createSupabaseRequest(pickupAddress, deliveryAddress, moveDate, description, items);
    
    if (success && user) {
      // Créer une notification pour l'utilisateur
      await createNotification(
        user.id,
        'Demande créée',
        'Votre demande de déménagement a été créée avec succès',
        'request_created'
      );
    }
    
    return success;
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus): Promise<boolean> => {
    const success = await updateSupabaseStatus(requestId, status);
    
    if (success) {
      // Trouver la demande pour notifier l'utilisateur
      const request = requests.find(r => r.id === requestId);
      if (request) {
        await createNotification(
          request.user_id,
          'Statut mis à jour',
          `Votre demande est maintenant ${status === 'approved' ? 'approuvée' : status === 'declined' ? 'refusée' : 'terminée'}`,
          'status_update',
          requestId
        );
      }
    }
    
    return success;
  };

  const assignRequestToAgent = async (requestId: string, agentId?: string): Promise<boolean> => {
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
      }
    }
    
    return success;
  };

  const transferRequestToAgent = async (requestId: string, agentId: string): Promise<boolean> => {
    return await assignSupabaseRequest(requestId, agentId);
  };

  // Filtrer les demandes selon le rôle et l'utilisateur
  const getUserRequests = (): MoveRequest[] => {
    if (!user) return [];
    return requests.filter(request => request.user_id === user.id);
  };

  const getPendingRequests = (): MoveRequest[] => {
    if (!user || (user.role !== 'agent' && user.role !== 'admin')) return [];
    return requests.filter(request => request.status === 'pending' && !request.agent_id);
  };

  const getAssignedRequests = (): MoveRequest[] => {
    if (!user || (user.role !== 'agent' && user.role !== 'admin')) return [];
    return requests.filter(request => 
      request.agent_id === user.id || 
      (user.role === 'admin' && request.agent_id)
    );
  };

  const refreshRequests = async () => {
    await fetchRequests();
  };

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
