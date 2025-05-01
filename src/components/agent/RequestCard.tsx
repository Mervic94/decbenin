
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, HomeIcon, MapPinIcon, UserIcon } from "lucide-react";
import { MoveRequest } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RequestCardProps {
  request: MoveRequest;
  openDetails: (request: MoveRequest) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">En attente</Badge>;
    case "approved":
      return <Badge className="bg-green-500">Approuvé</Badge>;
    case "declined":
      return <Badge variant="destructive">Refusé</Badge>;
    case "completed":
      return <Badge className="bg-blue-500">Terminé</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

const getAssignmentBadge = (request: MoveRequest, userId?: string) => {
  if (request.agent_id) {
    const isCurrentAgent = request.agent_id === userId;
    return (
      <Badge variant={isCurrentAgent ? "outline" : "secondary"} className={isCurrentAgent ? "border-primary text-primary" : ""}>
        {isCurrentAgent ? "Vous êtes assigné" : "Assigné à un agent"}
      </Badge>
    );
  }
  return null;
};

export const RequestCard = ({ request, openDetails }: RequestCardProps) => {
  const userId = undefined; // Sera remplacé par user?.id dans le composant parent

  return (
    <Card className="mb-4" onClick={() => openDetails(request)} style={{ cursor: "pointer" }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Déménagement du {format(new Date(request.moveDate), "d MMMM yyyy", { locale: fr })}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <UserIcon className="h-3 w-3" />
              Client #{request.user_id}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            {getStatusBadge(request.status)}
            {getAssignmentBadge(request, userId)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <HomeIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Départ</p>
              <p className="text-sm text-muted-foreground">
                {request.pickupAddress.city}, {request.pickupAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Destination</p>
              <p className="text-sm text-muted-foreground">
                {request.deliveryAddress.city}, {request.deliveryAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(request.moveDate), "EEEE d MMMM", { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            openDetails(request);
          }}
        >
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
};
