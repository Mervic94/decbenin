
import { MoveRequest, Address, RequestStatus } from '@/types';
import { toast } from 'sonner';
import { useNotificationService } from './useNotificationService';

// This hook handles higher-level operations on requests
export const useRequestOperations = (
  addRequest: (request: MoveRequest) => void,
  updateRequest: (request: MoveRequest) => void,
  getRequestById: (id: string) => MoveRequest | undefined,
  userId: string | undefined
) => {
  const { createNotification } = useNotificationService();

  const createRequest = async (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ): Promise<boolean> => {
    try {
      if (!userId) return false;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRequest: MoveRequest = {
        id: `${Date.now()}`, // Temporary ID generation
        user_id: userId,
        pickupAddress,
        deliveryAddress,
        moveDate: moveDate.toISOString().split('T')[0],
        description,
        items,
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        agent_id: null,
      };
      
      addRequest(newRequest);

      // Send notification to user
      await createNotification(
        userId,
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

  const updateRequestStatus = async (
    requestId: string,
    status: RequestStatus
  ): Promise<boolean> => {
    try {
      if (!userId) return false;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const request = getRequestById(requestId);
      if (!request) {
        toast.error('Demande introuvable');
        return false;
      }
      
      const updatedRequest: MoveRequest = {
        ...request,
        status,
        updated_at: new Date().toISOString().split('T')[0],
        ...(status === 'approved' ? { approved_by: userId } : {}),
      };
      
      updateRequest(updatedRequest);

      // Send notification to the request owner
      await createNotification(
        updatedRequest.user_id,
        `Demande de devis ${status === 'approved' ? 'approuvée' : 'refusée'}`,
        `Votre demande de devis a été ${status === 'approved' ? 'approuvée' : 'refusée'} par un agent.`,
        'status_update',
        requestId
      );
      
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
      if (!userId) return false;
      
      // Use the current user's ID if agentId is not provided
      const targetAgentId = agentId || userId;
      
      // Check if request exists
      const request = getRequestById(requestId);
      if (!request) {
        toast.error('Demande introuvable');
        return false;
      }
      
      // Validation logic
      if (request.agent_id && request.agent_id !== userId) {
        toast.error('Cette demande est déjà assignée à un autre agent');
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedRequest: MoveRequest = {
        ...request,
        agent_id: targetAgentId,
        updated_at: new Date().toISOString().split('T')[0],
      };
      
      updateRequest(updatedRequest);

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
      if (!userId) return false;
      
      // Check if request is assigned to current user
      const request = getRequestById(requestId);
      if (!request) {
        toast.error('Demande introuvable');
        return false;
      }
      
      if (request.agent_id !== userId) {
        toast.error('Vous ne pouvez pas transférer une demande qui ne vous est pas assignée');
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedRequest: MoveRequest = {
        ...request,
        agent_id: agentId,
        updated_at: new Date().toISOString().split('T')[0],
      };
      
      updateRequest(updatedRequest);

      toast.success('Demande transférée avec succès');
      return true;
    } catch (error) {
      console.error('Error transferring request:', error);
      toast.error('Erreur lors du transfert de la demande');
      return false;
    }
  };

  return {
    createRequest,
    updateRequestStatus,
    assignRequestToAgent,
    transferRequestToAgent,
  };
};
