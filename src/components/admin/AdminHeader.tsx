
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export const AdminHeader = () => {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Espace Administration</h1>
        <p className="text-muted-foreground">
          Bienvenue, {profile?.full_name || "Administrateur"}
        </p>
      </div>
      <Button variant="outline" className="mt-4 sm:mt-0">
        <RefreshCcw className="h-4 w-4 mr-2" />
        Actualiser
      </Button>
    </div>
  );
};
