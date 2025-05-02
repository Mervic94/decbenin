
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface AgentDashboardHeaderProps {
  fullName?: string | null;
  onRefresh: () => void;
  role?: string;
}

export const AgentDashboardHeader = ({ fullName, onRefresh, role = "Agent" }: AgentDashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Espace {role}</h1>
        <p className="text-muted-foreground">Bienvenue, {fullName || "Utilisateur"}</p>
      </div>
      <Button variant="outline" className="mt-4 sm:mt-0" onClick={onRefresh}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        Actualiser
      </Button>
    </div>
  );
};
