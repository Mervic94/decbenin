
import { useState } from 'react';
import { MoveRequest, Address, RequestStatus } from '@/types';
import { toast } from 'sonner';

// This hook handles the data storage and basic CRUD operations for move requests
export const useRequestRepository = () => {
  const [requests, setRequests] = useState<MoveRequest[]>([
    // Mock data with updated user IDs for demo accounts
    {
      id: '1',
      user_id: 'client-demo-id', // Will be replaced with actual user ID in a real implementation
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
      moveDate: '2025-05-25',
      description: 'Déménagement d\'un appartement 2 pièces',
      items: ['Canapé', 'Lit', 'Table', 'Chaises', 'Armoire'],
      status: 'pending',
      created_at: '2025-04-20',
      updated_at: '2025-04-20',
    },
    {
      id: '2',
      user_id: 'client-demo-id', // Will be replaced with actual user ID in a real implementation
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
      moveDate: '2025-06-15',
      description: 'Déménagement d\'un bureau',
      items: ['Bureau', 'Chaises de bureau', 'Classeurs', 'Ordinateurs'],
      status: 'approved',
      created_at: '2025-05-01',
      updated_at: '2025-05-02',
      approved_by: 'agent-demo-id',
      agent_id: 'agent-demo-id',
    },
    // Adding more mock data for demo purposes
    {
      id: '3',
      user_id: 'client-demo-id', // Will be replaced with actual user ID in a real implementation
      pickupAddress: {
        street: '25 Avenue des Arts',
        city: 'Porto-Novo',
        zipCode: '02 BP 4567',
        country: 'Bénin',
      },
      deliveryAddress: {
        street: '54 Rue de la Marina',
        city: 'Cotonou',
        zipCode: '01 BP 7890',
        country: 'Bénin',
      },
      moveDate: '2025-07-10',
      description: 'Déménagement d\'une maison 3 chambres',
      items: ['Canapé', 'Lit', 'Table', 'Chaises', 'Armoire', 'Réfrigérateur', 'Cuisinière'],
      status: 'completed',
      created_at: '2025-04-15',
      updated_at: '2025-04-30',
      approved_by: 'agent-demo-id',
      agent_id: 'agent-demo-id',
    },
    // Request for agent demo 
    {
      id: '4',
      user_id: 'other-client-id',
      pickupAddress: {
        street: '10 Boulevard de la République',
        city: 'Cotonou',
        zipCode: '01 BP 5432',
        country: 'Bénin',
      },
      deliveryAddress: {
        street: '78 Rue du Marché',
        city: 'Parakou',
        zipCode: '03 BP 1234',
        country: 'Bénin',
      },
      moveDate: '2025-06-05',
      description: 'Déménagement d\'un studio',
      items: ['Canapé-lit', 'Table basse', 'TV', 'Étagères'],
      status: 'pending',
      created_at: '2025-05-02',
      updated_at: '2025-05-02',
    },
  ]);

  // Add a new request
  const addRequest = (request: MoveRequest) => {
    setRequests(prevRequests => [...prevRequests, request]);
  };

  // Update an existing request
  const updateRequest = (updatedRequest: MoveRequest) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
  };

  // Get all requests
  const getAllRequests = () => requests;

  // Get a request by ID
  const getRequestById = (id: string) => requests.find(req => req.id === id);

  return {
    requests,
    addRequest,
    updateRequest,
    getAllRequests,
    getRequestById,
  };
};
