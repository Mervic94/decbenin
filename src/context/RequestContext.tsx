
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MoveRequest, Address, RequestStatus } from '@/types';
import { useAuth } from './AuthContext';

interface RequestContextType {
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
  updateRequestStatus: (requestId: string, status: RequestStatus) => Promise<boolean>;
}

// Mock data
const MOCK_REQUESTS: MoveRequest[] = [
  {
    id: '1',
    user_id: '1',
    pickupAddress: {
      street: '123 Rue Principale',
      city: 'Cotonou',
      zipCode: '01 BP 1234',
      country: 'Bénin',
    },
    deliveryAddress: {
      street: '456 Avenue Centrale',
      city: 'Cotonou',
      zipCode: '01 BP 5678',
      country: 'Bénin',
    },
    moveDate: '2025-05-25', // Changed to string ISO format
    description: 'Déménagement d\'un appartement 2 pièces',
    items: ['Canapé', 'Lit', 'Table', 'Chaises', 'Armoire'],
    status: 'pending',
    created_at: '2025-04-20', // Changed to string ISO format
    updated_at: '2025-04-20', // Changed to string ISO format
  },
  {
    id: '2',
    user_id: '1',
    pickupAddress: {
      street: '789 Boulevard Maritime',
      city: 'Cotonou',
      zipCode: '01 BP 9012',
      country: 'Bénin',
    },
    deliveryAddress: {
      street: '101 Rue du Commerce',
      city: 'Porto-Novo',
      zipCode: '02 BP 3456',
      country: 'Bénin',
    },
    moveDate: '2025-06-15', // Changed to string ISO format
    description: 'Déménagement d\'un bureau',
    items: ['Bureau', 'Chaises de bureau', 'Classeurs', 'Ordinateurs'],
    status: 'approved',
    created_at: '2025-05-01', // Changed to string ISO format
    updated_at: '2025-05-02', // Changed to string ISO format
    approved_by: '2',
  },
];

const RequestContext = createContext<RequestContextType>({} as RequestContextType);

export const useRequests = () => useContext(RequestContext);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MoveRequest[]>([...MOCK_REQUESTS]);

  const createRequest = async (
    pickupAddress: Address,
    deliveryAddress: Address,
    moveDate: Date,
    description: string,
    items: string[]
  ): Promise<boolean> => {
    try {
      if (!user) return false;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRequest: MoveRequest = {
        id: `${requests.length + 1}`,
        user_id: user.id,
        pickupAddress,
        deliveryAddress,
        moveDate: moveDate.toISOString().split('T')[0], // Convert Date to ISO string date format
        description,
        items,
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0], // Convert Date to ISO string date format
        updated_at: new Date().toISOString().split('T')[0], // Convert Date to ISO string date format
      };
      
      setRequests(prevRequests => [...prevRequests, newRequest]);
      return true;
    } catch (error) {
      console.error('Error creating request:', error);
      return false;
    }
  };

  const getUserRequests = (): MoveRequest[] => {
    if (!user) return [];
    return requests.filter(request => request.user_id === user.id);
  };

  const getPendingRequests = (): MoveRequest[] => {
    if (user?.role !== 'agent' && user?.role !== 'admin') return [];
    return requests.filter(request => request.status === 'pending');
  };

  const updateRequestStatus = async (
    requestId: string,
    status: RequestStatus
  ): Promise<boolean> => {
    try {
      if (!user || (user.role !== 'agent' && user.role !== 'admin')) return false;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? {
                ...req,
                status,
                updated_at: new Date().toISOString().split('T')[0], // Convert Date to ISO string date format
                ...(status === 'approved' ? { approved_by: user.id } : {}),
              }
            : req
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      return false;
    }
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        createRequest,
        getUserRequests,
        getPendingRequests,
        updateRequestStatus,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
