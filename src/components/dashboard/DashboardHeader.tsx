
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types";

interface DashboardHeaderProps {
  fullName: string | undefined;
  isAgent?: boolean;
}

export const DashboardHeader = ({ fullName, isAgent = false }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue, {fullName || "Utilisateur"}
        </p>
      </div>
      {!isAgent && (
        <Button onClick={() => navigate("/quote")}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
        </Button>
      )}
    </div>
  );
};
