
import { MoveRequest, RequestStatus } from '@/types';
import { toast } from 'sonner';
import { useNotificationService } from '@/hooks/useNotificationService';

export const useRequestStatusUpdate = (
  updateRequest: (request: MoveRequest) => void,
  getRequestById: (id: string) => MoveRequest | undefined,
  userId: string | undefined
) => {
  const { createNotification } = useNotificationService();

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

  return { updateRequestStatus };
};
