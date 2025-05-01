
import { TruckIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const EmptyRequestState = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-muted">
      <CardContent className="flex flex-col items-center justify-center py-8">
        <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune demande</h3>
        <p className="text-muted-foreground text-center mb-4">
          Vous n'avez pas encore soumis de demande de déménagement
        </p>
        <Button onClick={() => navigate("/quote")}>
          <Plus className="mr-2 h-4 w-4" /> Créer une demande
        </Button>
      </CardContent>
    </Card>
  );
};
