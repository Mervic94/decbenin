
import { MoveRequest } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HomeIcon, MapPinIcon, CalendarIcon } from "lucide-react";

interface RequestCardProps {
  request: MoveRequest;
}

export const RequestCard = ({ request }: RequestCardProps) => {
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

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Déménagement du {format(new Date(request.moveDate), "d MMMM yyyy", { locale: fr })}
            </CardTitle>
            <CardDescription>
              Demande créée le {format(new Date(request.created_at || ""), "d MMMM yyyy", { locale: fr })}
            </CardDescription>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <HomeIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Adresse de départ</p>
              <p className="text-sm text-muted-foreground">
                {request.pickupAddress.street}, {request.pickupAddress.city},{" "}
                {request.pickupAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Adresse de destination</p>
              <p className="text-sm text-muted-foreground">
                {request.deliveryAddress.street}, {request.deliveryAddress.city},{" "}
                {request.deliveryAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date du déménagement</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(request.moveDate), "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">{request.description}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Articles à déménager</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {request.items.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full">
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
};
