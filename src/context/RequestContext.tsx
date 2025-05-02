
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MoveRequest, Address, RequestStatus } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useRequestRepository } from '@/hooks/useRequestRepository';
import { useRequestOperations } from '@/hooks/useRequestOperations';
import { useRequestQueries } from '@/hooks/useRequestQueries';

interface RequestContextType {
  requests: MoveRequest[];
  createRequest: (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ) => Promise<boolean>;
  getUserRequests: () => MoveRequest[];
  getPendingRequests: () => MoveRequest[];
  getAssignedRequests: () => MoveRequest[];
  updateRequestStatus: (requestId: string, status: RequestStatus) => Promise<boolean>;
  assignRequestToAgent: (requestId: string, agentId?: string) => Promise<boolean>;
  transferRequestToAgent: (requestId: string, agentId: string) => Promise<boolean>;
  refreshRequests: () => Promise<void>;
}

const RequestContext = createContext<RequestContextType>({} as RequestContextType);

export const useRequests = () => useContext(RequestContext);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // Utiliser nos hooks personnalisés
  const { 
    requests,
    addRequest, 
    updateRequest, 
    getAllRequests,
    getRequestById 
  } = useRequestRepository();
  
  // Créer une instance modifiée de useRequestOperations qui a accès à getAllRequests
  const { 
    createRequest, 
    updateRequestStatus, 
    assignRequestToAgent, 
    transferRequestToAgent 
  } = useRequestOperations(
    addRequest,
    updateRequest,
    getRequestById,
    user?.id
  );
  
  const { 
    getUserRequests, 
    getPendingRequests, 
    getAssignedRequests 
  } = useRequestQueries(
    requests,
    user?.id,
    user?.role
  );

  // Récupérer les demandes depuis Supabase lorsque disponible
  useEffect(() => {
    if (user) {
      refreshRequests();
    }
  }, [user]);

  const refreshRequests = async () => {
    try {
      // Dans une implémentation réelle, cela récupérerait depuis Supabase
      console.log('Rafraîchissement des données de demandes');
      
      // C'est ici que vous récupéreriez depuis Supabase dans une implémentation réelle
      // const { data, error } = await supabase.from('requests').select('*');
      // if (error) throw error;
      // setRequests(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
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
