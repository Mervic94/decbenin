
import { MoveRequest } from '@/types';
import { toast } from 'sonner';
import { useNotificationService } from '@/hooks/useNotificationService';

export const useRequestAssignment = (
  updateRequest: (request: MoveRequest) => void,
  getRequestById: (id: string) => MoveRequest | undefined,
  getAllRequests: () => MoveRequest[],
  userId: string | undefined
) => {
  const { createNotification } = useNotificationService();

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

  return { assignRequestToAgent };
};
