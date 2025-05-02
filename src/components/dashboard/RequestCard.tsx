
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, HomeIcon, MapPinIcon, UserIcon } from "lucide-react";
import { MoveRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RequestCardProps {
  request: MoveRequest;
  showAgentName?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">En attente</Badge>;
    case "approved":
      return <Badge className="bg-green-500 text-white">En cours</Badge>;
    case "declined":
      return <Badge variant="destructive">Refusé</Badge>;
    case "completed":
      return <Badge className="bg-blue-500 text-white">Validé</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

export const RequestCard = ({ request, showAgentName = false }: RequestCardProps) => {
  const navigate = useNavigate();
  const [agentName, setAgentName] = useState<string | null>(null);
  
  useEffect(() => {
    // Récupérer le nom de l'agent si la demande est assignée
    const fetchAgentName = async () => {
      if (request.agent_id) {
        try {
          // Dans une implémentation réelle, cela récupérerait depuis Supabase
          // Pour l'instant, nous utilisons un nom fictif
          if (request.agent_id === 'agent-demo-id') {
            setAgentName('Agent Demo');
          } else if (request.agent_id === 'agent1') {
            setAgentName('Agent 1');
          } else if (request.agent_id === 'agent2') {
            setAgentName('Agent 2');
          } else if (request.agent_id === 'agent3') {
            setAgentName('Agent 3');
          } else {
            setAgentName('Agent assigné');
          }
          
          // Code réel avec Supabase:
          // const { data, error } = await supabase
          //   .from('profiles')
          //   .select('full_name')
          //   .eq('id', request.agent_id)
          //   .single();
          // 
          // if (data) {
          //   setAgentName(data.full_name);
          // }
        } catch (error) {
          console.error('Erreur lors de la récupération du nom de l\'agent:', error);
        }
      }
    };
    
    if (showAgentName) {
      fetchAgentName();
    }
  }, [request.agent_id, showAgentName]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Déménagement du {format(new Date(request.moveDate), "d MMMM yyyy", { locale: fr })}
            </CardTitle>
            <CardDescription>Demande #{request.id}</CardDescription>
          </div>
          <div>
            {getStatusBadge(request.status)}
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
              <p className="text-sm font-medium">Date prévue</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(request.moveDate), "EEEE d MMMM", { locale: fr })}
              </p>
            </div>
          </div>
          
          {showAgentName && request.agent_id && (
            <div className="flex items-start gap-2">
              <UserIcon className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Agent en charge</p>
                <p className="text-sm text-muted-foreground">
                  {agentName || "Agent assigné"}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/quote/${request.id}`)}
        >
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
};
