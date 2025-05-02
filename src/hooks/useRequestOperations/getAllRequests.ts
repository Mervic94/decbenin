
import { MoveRequest } from '@/types';

export const useGetAllRequests = () => {
  // Fonction pour obtenir toutes les demandes
  const getAllRequests = (): MoveRequest[] => {
    // Dans une implémentation réelle, cela serait récupéré depuis le contexte ou le repository
    // Pour l'instant, nous retournons un tableau vide comme placeholder
    return [];
  };

  return { getAllRequests };
};
