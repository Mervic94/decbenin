
import { MoveRequest } from '@/types';
import { toast } from 'sonner';

export const useRequestTransfer = (
  updateRequest: (request: MoveRequest) => void,
  getRequestById: (id: string) => MoveRequest | undefined,
  getAllRequests: () => MoveRequest[],
  userId: string | undefined
) => {
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

  return { transferRequestToAgent };
};
