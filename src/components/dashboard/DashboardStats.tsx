
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRequest } from "@/types";

interface DashboardStatsProps {
  requests: MoveRequest[];
}

export const DashboardStats = ({ requests }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{requests.length}</div>
          <p className="text-muted-foreground text-sm">Total de demandes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">En attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {requests.filter((req) => req.status === "pending").length}
          </div>
          <p className="text-muted-foreground text-sm">Demandes en attente</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Approuvées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {requests.filter((req) => req.status === "approved").length}
          </div>
          <p className="text-muted-foreground text-sm">Demandes approuvées</p>
        </CardContent>
      </Card>
    </div>
  );
};
