
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MoveRequest, Address, RequestStatus } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Mock data
const MOCK_REQUESTS: MoveRequest[] = [
  {
    id: '1',
    user_id: '1',
    pickupAddress: {
      street: '123 Rue Principale',
      city: 'Cotonou',
      zipCode: '01 BP 1234',
      country: 'Bénin',
    },
    deliveryAddress: {
      street: '456 Avenue Centrale',
      city: 'Cotonou',
      zipCode: '01 BP 5678',
      country: 'Bénin',
    },
    moveDate: '2025-05-25', // Changed to string ISO format
    description: 'Déménagement d\'un appartement 2 pièces',
    items: ['Canapé', 'Lit', 'Table', 'Chaises', 'Armoire'],
    status: 'pending',
    created_at: '2025-04-20', // Changed to string ISO format
    updated_at: '2025-04-20', // Changed to string ISO format
  },
  {
    id: '2',
    user_id: '1',
    pickupAddress: {
      street: '789 Boulevard Maritime',
      city: 'Cotonou',
      zipCode: '01 BP 9012',
      country: 'Bénin',
    },
    deliveryAddress: {
      street: '101 Rue du Commerce',
      city: 'Porto-Novo',
      zipCode: '02 BP 3456',
      country: 'Bénin',
    },
    moveDate: '2025-06-15', // Changed to string ISO format
    description: 'Déménagement d\'un bureau',
    items: ['Bureau', 'Chaises de bureau', 'Classeurs', 'Ordinateurs'],
    status: 'approved',
    created_at: '2025-05-01', // Changed to string ISO format
    updated_at: '2025-05-02', // Changed to string ISO format
    approved_by: '2',
    agent_id: null,
  },
];

const RequestContext = createContext<RequestContextType>({} as RequestContextType);

export const useRequests = () => useContext(RequestContext);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MoveRequest[]>([...MOCK_REQUESTS]);

  // Fetch requests from Supabase when available
  useEffect(() => {
    if (user) {
      refreshRequests();
    }
  }, [user]);

  const refreshRequests = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, using mock data
      console.log('Refreshing requests data');
      
      // This is where you would fetch from Supabase in a real implementation
      // const { data, error } = await supabase.from('requests').select('*');
      // if (error) throw error;
      // setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const createRequest = async (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ): Promise<boolean> => {
    try {
      if (!user) return false;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRequest: MoveRequest = {
        id: `${requests.length + 1}`,
        user_id: user.id,
        pickupAddress,
        deliveryAddress,
        moveDate: moveDate.toISOString().split('T')[0], // Convert Date to ISO string date format
        description,
        items,
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0], // Convert Date to ISO string date format
        updated_at: new Date().toISOString().split('T')[0], // Convert Date to ISO string date format
        agent_id: null, // No agent assigned initially
      };
      
      setRequests(prevRequests => [...prevRequests, newRequest]);

      // Send notification to user
      await createNotification(
        user.id,
        'Demande de devis reçue',
        'Votre demande de devis a été reçue et sera traitée par un agent prochainement.',
        'quote_request',
        newRequest.id
      );

      return true;
    } catch (error) {
      console.error('Error creating request:', error);
      return false;
    }
  };

  const getUserRequests = (): MoveRequest[] => {
    if (!user) return [];
    return requests.filter(request => request.user_id === user.id);
  };

  const getPendingRequests = (): MoveRequest[] => {
    if (user?.role !== 'agent' && user?.role !== 'admin') return [];
    // Return all pending requests that are not assigned to any agent
    return requests.filter(request => request.status === 'pending' && !request.agent_id);
  };

  const getAssignedRequests = (): MoveRequest[] => {
    if (!user || (user.role !== 'agent' && user.role !== 'admin')) return [];
    // Return requests assigned to the current agent
    return requests.filter(request => 
      request.agent_id === user.id || 
      (user.role === 'admin') // Admins can see all assigned requests
    );
  };

  const updateRequestStatus = async (
    requestId: string,
    status: RequestStatus
  ): Promise<boolean> => {
    try {
      if (!user || (user.role !== 'agent' && user.role !== 'admin')) return false;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let updatedRequest: MoveRequest | undefined;
      
      setRequests(prevRequests =>
        prevRequests.map(req => {
          if (req.id === requestId) {
            updatedRequest = {
              ...req,
              status,
              updated_at: new Date().toISOString().split('T')[0],
              ...(status === 'approved' ? { approved_by: user.id } : {}),
            };
            return updatedRequest;
          }
          return req;
        })
      );

      if (updatedRequest) {
        // Send notification to the request owner
        await createNotification(
          updatedRequest.user_id,
          `Demande de devis ${status === 'approved' ? 'approuvée' : 'refusée'}`,
          `Votre demande de devis a été ${status === 'approved' ? 'approuvée' : 'refusée'} par un agent.`,
          'status_update',
          requestId
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      return false;
    }
  };

  const assignRequestToAgent = async (
    requestId: string,
    agentId?: string
  ): Promise<boolean> => {
    try {
      if (!user || (user.role !== 'agent' && user.role !== 'admin')) return false;
      
      // Use the current user's ID if agentId is not provided
      const targetAgentId = agentId || user.id;
      
      // Check if request is already assigned
      const request = requests.find(req => req.id === requestId);
      if (!request) {
        toast.error('Demande introuvable');
        return false;
      }
      
      if (request.agent_id && request.agent_id !== user.id && user.role !== 'admin') {
        toast.error('Cette demande est déjà assignée à un autre agent');
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? {
                ...req,
                agent_id: targetAgentId,
                updated_at: new Date().toISOString().split('T')[0],
              }
            : req
        )
      );

      toast.success('Demande assignée avec succès');
      return true;
    } catch (error) {
      console.error('Error assigning request:', error);
      toast.error('Erreur lors de l\'assignation de la demande');
      return false;
    }
  };

  const transferRequestToAgent = async (
    requestId: string,
    agentId: string
  ): Promise<boolean> => {
    try {
      if (!user || (user.role !== 'agent' && user.role !== 'admin')) return false;
      
      // Check if request is assigned to current user or if user is admin
      const request = requests.find(req => req.id === requestId);
      if (!request) {
        toast.error('Demande introuvable');
        return false;
      }
      
      if (request.agent_id !== user.id && user.role !== 'admin') {
        toast.error('Vous ne pouvez pas transférer une demande qui ne vous est pas assignée');
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? {
                ...req,
                agent_id: agentId,
                updated_at: new Date().toISOString().split('T')[0],
              }
            : req
        )
      );

      toast.success('Demande transférée avec succès');
      return true;
    } catch (error) {
      console.error('Error transferring request:', error);
      toast.error('Erreur lors du transfert de la demande');
      return false;
    }
  };

  // Helper function to create notification (mock for now)
  const createNotification = async (
    userId: string,
    title: string,
    content: string,
    type: string,
    referenceId: string
  ) => {
    // In a real implementation, this would create a notification in Supabase
    console.log('Creating notification:', { userId, title, content, type, referenceId });
    
    // Mock implementation - would be replaced with actual Supabase call
    // const { error } = await supabase.from('notifications').insert({
    //   user_id: userId,
    //   title,
    //   content,
    //   type,
    //   reference_id: referenceId,
    // });
    
    // if (error) throw error;
    return true;
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
