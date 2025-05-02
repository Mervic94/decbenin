
// Pour éviter les erreurs de TypeScript, mettez à jour les props du composant RequestCard pour accepter une propriété customAction

import { MoveRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export interface RequestCardProps {
  request: MoveRequest;
  openDetails: () => void;
  customAction?: (request: MoveRequest) => ReactNode;
}

export const RequestCard = ({ request, openDetails, customAction }: RequestCardProps) => {
  // Votre code existant ici
  return (
    <div 
      onClick={openDetails}
      className="p-4 border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-all"
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-lg font-semibold">
          {request.pickupAddress.city} → {request.deliveryAddress.city}
        </h3>
        <Badge variant={
          request.status === 'completed' 
            ? 'outline' 
            : request.status === 'approved'
              ? 'default'
              : request.status === 'declined'
                ? 'destructive'
                : 'secondary'
        }>
          {request.status === 'approved' ? 'Approuvé' : 
          request.status === 'pending' ? 'En attente' : 
          request.status === 'declined' ? 'Refusé' : 'Terminé'}
        </Badge>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Prévu pour: {new Date(request.moveDate).toLocaleDateString('fr-FR')}
      </p>
      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-semibold">Départ:</span> {request.pickupAddress.street}, {request.pickupAddress.city}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Arrivée:</span> {request.deliveryAddress.street}, {request.deliveryAddress.city}
        </p>
      </div>
      
      {/* Render custom action if provided */}
      {customAction && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          {customAction(request)}
        </div>
      )}
    </div>
  );
};
