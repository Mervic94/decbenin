
import { MoveRequest, Address, RequestStatus } from '@/types';
import { toast } from 'sonner';
import { useNotificationService } from './useNotificationService';

// Ce hook gère les opérations de haut niveau sur les demandes
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

      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRequest: MoveRequest = {
        id: `${Date.now()}`, // Génération temporaire d'ID
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

      // Envoyer une notification à l'utilisateur
      await createNotification(
        userId,
        'Demande de devis reçue',
        'Votre demande de devis a été reçue et sera traitée par un agent prochainement.',
        'quote_request',
        newRequest.id
      );

      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      return false;
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    status: RequestStatus
  ): Promise<boolean> => {
    try {
      if (!userId) return false;

      // Simuler un délai d'API
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

      // Envoyer une notification au propriétaire de la demande
      await createNotification(
        updatedRequest.user_id,
        `Demande de devis ${status === 'approved' ? 'en cours de traitement' : (status === 'completed' ? 'validée' : 'refusée')}`,
        `L'état de votre demande de devis a été mis à jour par l'agent.`,
        'status_update',
        requestId
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état de la demande:", error);
      return false;
    }
  };

  const assignRequestToAgent = async (
    requestId: string,
    agentId?: string
  ): Promise<boolean> => {
    try {
      if (!userId) return false;
      
      // Utiliser l'ID de l'utilisateur courant si agentId n'est pas fourni
      const targetAgentId = agentId || userId;
      
      // Vérifier si la demande existe
      const request = getRequestById(requestId);
      if (!request) {
        toast.error('Demande introuvable');
        return false;
      }
      
      // Vérifier le nombre de demandes déjà assignées à cet agent
      // Récupérer toutes les demandes assignées à cet agent avec le statut "approved" (en cours)
      const assignedRequests = getAllRequests().filter(req => 
        req.agent_id === targetAgentId && 
        (req.status === 'approved' || req.status === 'pending')
      );
      
      if (assignedRequests.length >= 5) {
        toast.error("Vous ne pouvez pas traiter plus de 5 demandes simultanément");
        return false;
      }
      
      // Logique de validation
      if (request.agent_id && request.agent_id !== userId) {
        toast.error('Cette demande est déjà assignée à un autre agent');
        return false;
      }
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedRequest: MoveRequest = {
        ...request,
        agent_id: targetAgentId,
        status: 'approved', // Mise à jour du statut à "en cours" lors de l'assignation
        updated_at: new Date().toISOString().split('T')[0],
        assigned_at: new Date().toISOString().split('T')[0],
      };
      
      updateRequest(updatedRequest);

      // Notification à l'utilisateur
      await createNotification(
        updatedRequest.user_id,
        'Demande prise en charge',
        'Votre demande de déménagement est maintenant en cours de traitement par un agent.',
        'request_assigned',
        requestId
      );

      toast.success('Demande assignée avec succès');
      return true;
    } catch (error) {
      console.error("Erreur lors de l'assignation de la demande:", error);
      toast.error("Erreur lors de l'assignation de la demande");
      return false;
    }
  };

  const transferRequestToAgent = async (
    requestId: string,
    agentId: string
  ): Promise<boolean> => {
    try {
      if (!userId) return false;
      
      // Vérifier si la demande est assignée à l'utilisateur courant
      const request = getRequestById(requestId);
      if (!request) {
        toast.error('Demande introuvable');
        return false;
      }
      
      if (request.agent_id !== userId) {
        toast.error('Vous ne pouvez pas transférer une demande qui ne vous est pas assignée');
        return false;
      }
      
      // Vérifier le nombre de demandes déjà assignées à l'agent cible
      // Récupérer toutes les demandes assignées à cet agent avec le statut "approved" (en cours)
      const assignedRequests = getAllRequests().filter(req => 
        req.agent_id === agentId && 
        (req.status === 'approved' || req.status === 'pending')
      );
      
      if (assignedRequests.length >= 5) {
        toast.error("L'agent sélectionné ne peut pas traiter plus de 5 demandes simultanément");
        return false;
      }
      
      // Simuler un délai d'API
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
      console.error('Erreur lors du transfert de la demande:', error);
      toast.error('Erreur lors du transfert de la demande');
      return false;
    }
  };

  // Fonction interne pour obtenir toutes les demandes
  // Cette fonction doit être disponible pour vérifier le nombre de demandes assignées
  const getAllRequests = (): MoveRequest[] => {
    // Dans une implémentation réelle, cela serait récupéré depuis le contexte ou le repository
    // Pour l'instant, nous récupérons les demandes directement
    return [];
  };

  return {
    createRequest,
    updateRequestStatus,
    assignRequestToAgent,
    transferRequestToAgent,
  };
};
