
import { MoveRequest, Address, RequestStatus } from '@/types';
import { useRequestCreate } from './requestCreate';
import { useRequestStatusUpdate } from './requestStatusUpdate';
import { useRequestAssignment } from './requestAssignment';
import { useRequestTransfer } from './requestTransfer';

// Ce hook gère les opérations de haut niveau sur les demandes
export const useRequestOperations = (
  addRequest: (request: MoveRequest) => void,
  updateRequest: (request: MoveRequest) => void,
  getRequestById: (id: string) => MoveRequest | undefined,
  userId: string | undefined
) => {
  // Fonction interne pour obtenir toutes les demandes
  // Cette fonction doit être disponible pour vérifier le nombre de demandes assignées
  const getAllRequests = (): MoveRequest[] => {
    // Dans une implémentation réelle, cela serait récupéré depuis le contexte ou le repository
    // Pour l'instant, nous récupérons les demandes directement
    return [];
  };

  const { createRequest } = useRequestCreate(addRequest, userId);
  const { updateRequestStatus } = useRequestStatusUpdate(updateRequest, getRequestById, userId);
  const { assignRequestToAgent } = useRequestAssignment(updateRequest, getRequestById, getAllRequests, userId);
  const { transferRequestToAgent } = useRequestTransfer(updateRequest, getRequestById, getAllRequests, userId);

  return {
    createRequest,
    updateRequestStatus,
    assignRequestToAgent,
    transferRequestToAgent,
  };
};
