
import { MoveRequest } from '@/types';

// This hook provides query functions to filter requests
export const useRequestQueries = (
  requests: MoveRequest[],
  userId: string | undefined,
  userRole?: string
) => {
  // Get requests for the current user
  const getUserRequests = (): MoveRequest[] => {
    if (!userId) return [];
    return requests.filter(request => request.user_id === userId);
  };

  // Get pending requests (for agents)
  const getPendingRequests = (): MoveRequest[] => {
    if (userRole !== 'agent' && userRole !== 'admin') return [];
    // Return all pending requests that are not assigned to any agent
    return requests.filter(request => request.status === 'pending' && !request.agent_id);
  };

  // Get requests assigned to the current agent
  const getAssignedRequests = (): MoveRequest[] => {
    if (!userId || (userRole !== 'agent' && userRole !== 'admin')) return [];
    // Return requests assigned to the current agent or all assigned requests for admins
    return requests.filter(request => 
      request.agent_id === userId || 
      (userRole === 'admin') // Admins can see all assigned requests
    );
  };

  return {
    getUserRequests,
    getPendingRequests,
    getAssignedRequests,
  };
};
