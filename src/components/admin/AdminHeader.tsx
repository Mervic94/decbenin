
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Settings, Users, FileText, Package, Database } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const AdminHeader = () => {
  const { profile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Données actualisées",
        description: "Les informations ont été mises à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Espace Administration</h1>
          <p className="text-muted-foreground">
            Bienvenue, {profile?.full_name || "Administrateur"}
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 sm:mt-0"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>
      
      <div className="flex overflow-x-auto gap-2 pb-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>Utilisateurs</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Package className="h-4 w-4" />
          <span>Demandes</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>Rapports</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Database className="h-4 w-4" />
          <span>Base de données</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>Configuration</span>
        </Button>
      </div>
    </div>
  );
};
