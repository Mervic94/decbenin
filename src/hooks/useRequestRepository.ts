
import { useState } from 'react';
import { MoveRequest, Address, RequestStatus } from '@/types';
import { toast } from 'sonner';

// Ce hook gère le stockage des données et les opérations CRUD de base pour les demandes de déménagement
export const useRequestRepository = () => {
  const [requests, setRequests] = useState<MoveRequest[]>([
    // Données simulées avec des ID utilisateur mis à jour pour les comptes de démonstration
    {
      id: '1',
      user_id: 'client-demo-id', // Sera remplacé par l'ID utilisateur réel dans une implémentation réelle
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
      user_id: 'client-demo-id', // Sera remplacé par l'ID utilisateur réel dans une implémentation réelle
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
    // Ajout de données simulées supplémentaires à des fins de démonstration
    {
      id: '3',
      user_id: 'client-demo-id', // Sera remplacé par l'ID utilisateur réel dans une implémentation réelle
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
    // Demande pour la démonstration de l'agent
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
    // Demandes supplémentaires pour tester la limite de 5 demandes par agent
    {
      id: '5',
      user_id: 'client-demo-id',
      pickupAddress: {
        street: '15 Rue du Marché',
        city: 'Cotonou',
        zipCode: '01 BP 6789',
        country: 'Bénin',
      },
      deliveryAddress: {
        street: '88 Avenue des Cocotiers',
        city: 'Cotonou',
        zipCode: '01 BP 4321',
        country: 'Bénin',
      },
      moveDate: '2025-06-20',
      description: 'Déménagement d\'un petit bureau',
      items: ['Bureau', 'Chaise', 'Ordinateur', 'Imprimante'],
      status: 'pending',
      created_at: '2025-05-05',
      updated_at: '2025-05-05',
    },
    {
      id: '6',
      user_id: 'client-demo-id',
      pickupAddress: {
        street: '22 Boulevard du Port',
        city: 'Cotonou',
        zipCode: '01 BP 9876',
        country: 'Bénin',
      },
      deliveryAddress: {
        street: '44 Avenue de l\'Indépendance',
        city: 'Porto-Novo',
        zipCode: '02 BP 5678',
        country: 'Bénin',
      },
      moveDate: '2025-07-05',
      description: 'Déménagement d\'un studio étudiant',
      items: ['Lit simple', 'Bureau', 'Chaise', 'Étagère'],
      status: 'pending',
      created_at: '2025-05-10',
      updated_at: '2025-05-10',
    }
  ]);

  // Ajouter une nouvelle demande
  const addRequest = (request: MoveRequest) => {
    setRequests(prevRequests => [...prevRequests, request]);
  };

  // Mettre à jour une demande existante
  const updateRequest = (updatedRequest: MoveRequest) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
  };

  // Récupérer toutes les demandes
  const getAllRequests = () => requests;

  // Récupérer une demande par ID
  const getRequestById = (id: string) => requests.find(req => req.id === id);

  return {
    requests,
    addRequest,
    updateRequest,
    getAllRequests,
    getRequestById,
  };
};
