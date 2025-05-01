
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveRequest } from "@/types";

interface AgentDashboardStatsProps {
  pendingRequests: MoveRequest[];
  assignedRequests: MoveRequest[];
  declinedRequests: MoveRequest[];
}

export const AgentDashboardStats = ({ 
  pendingRequests, 
  assignedRequests, 
  declinedRequests 
}: AgentDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">En attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{pendingRequests.length}</div>
          <p className="text-muted-foreground text-sm">Demandes à traiter</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Mes demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{assignedRequests.length}</div>
          <p className="text-muted-foreground text-sm">Demandes assignées</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Refusées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{declinedRequests.length}</div>
          <p className="text-muted-foreground text-sm">Demandes refusées</p>
        </CardContent>
      </Card>
    </div>
  );
};
