
import { MoveRequest, Address } from '@/types';
import { useNotificationService } from '@/hooks/useNotificationService';

export const useRequestCreate = (
  addRequest: (request: MoveRequest) => void,
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

  return { createRequest };
};
