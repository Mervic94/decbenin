
import { MoveRequest } from '@/types';
import { useRequestCreate } from './requestCreate';
import { useRequestStatusUpdate } from './requestStatusUpdate';
import { useRequestAssignment } from './requestAssignment';
import { useRequestTransfer } from './requestTransfer';
import { useGetAllRequests } from './getAllRequests';

// Ce hook gère les opérations de haut niveau sur les demandes
export const useRequestOperations = (
  addRequest: (request: MoveRequest) => void,
  updateRequest: (request: MoveRequest) => void,
  getRequestById: (id: string) => MoveRequest | undefined,
  userId: string | undefined
) => {
  // Hook pour obtenir toutes les demandes
  const { getAllRequests } = useGetAllRequests();

  // Hooks d'opérations sur les demandes
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
