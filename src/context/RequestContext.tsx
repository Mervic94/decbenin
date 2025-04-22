
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
    userId: '1',
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
    moveDate: new Date(2025, 4, 25),
    description: 'Déménagement d\'un appartement 2 pièces',
    items: ['Canapé', 'Lit', 'Table', 'Chaises', 'Armoire'],
    status: 'pending',
    createdAt: new Date(2025, 4, 20),
    updatedAt: new Date(2025, 4, 20),
  },
  {
    id: '2',
    userId: '1',
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
    moveDate: new Date(2025, 5, 15),
    description: 'Déménagement d\'un bureau',
    items: ['Bureau', 'Chaises de bureau', 'Classeurs', 'Ordinateurs'],
    status: 'approved',
    createdAt: new Date(2025, 5, 1),
    updatedAt: new Date(2025, 5, 2),
    approvedBy: '2',
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
        userId: user.id,
        pickupAddress,
        deliveryAddress,
        moveDate,
        description,
        items,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
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
    return requests.filter(request => request.userId === user.id);
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
                updatedAt: new Date(),
                ...(status === 'approved' ? { approvedBy: user.id } : {}),
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
