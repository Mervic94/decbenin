
import { Button } from "@/components/ui/button";

interface AgentDashboardHeaderProps {
  fullName: string | undefined;
  onRefresh: () => void;
}

export const AgentDashboardHeader = ({ fullName, onRefresh }: AgentDashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Espace Agent</h1>
        <p className="text-muted-foreground">
          Bienvenue, {fullName || "Agent"}
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onRefresh}
      >
        Rafraîchir
      </Button>
    </div>
  );
};
