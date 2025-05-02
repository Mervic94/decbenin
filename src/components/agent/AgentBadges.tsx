
import { Badge } from "@/components/ui/badge";
import { MoveRequest } from "@/types";

export const StatusBadge = ({ status }: { status: string }) => {
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

export const AssignmentBadge = ({ request, userId }: { request: MoveRequest, userId?: string }) => {
  if (request.agent_id) {
    const isCurrentAgent = request.agent_id === userId;
    return (
      <Badge 
        variant={isCurrentAgent ? "outline" : "secondary"} 
        className={isCurrentAgent ? "border-primary text-primary" : ""}
      >
        {isCurrentAgent ? "Vous êtes assigné" : "Assigné à un agent"}
      </Badge>
    );
  }
  return null;
};
