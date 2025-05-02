
import { createContext } from 'react';
import { MoveRequest, Address, RequestStatus } from '@/types';

export interface RequestContextType {
  requests: MoveRequest[];
  createRequest: (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ) => Promise<boolean>;
  getUserRequests: () => MoveRequest[];
  getPendingRequests: () => MoveRequest[];
  getAssignedRequests: () => MoveRequest[];
  updateRequestStatus: (requestId: string, status: RequestStatus) => Promise<boolean>;
  assignRequestToAgent: (requestId: string, agentId?: string) => Promise<boolean>;
  transferRequestToAgent: (requestId: string, agentId: string) => Promise<boolean>;
  refreshRequests: () => Promise<void>;
}

const RequestContext = createContext<RequestContextType>({} as RequestContextType);

export default RequestContext;
