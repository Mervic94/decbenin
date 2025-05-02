
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProfileDetailsProps {
  user?: any;
  profile?: any;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
  // Add these properties to fix the error
  fullName?: string;
  email?: string;
}

export const ProfileDetails = ({ 
  user,
  profile,
  isLoading,
  setIsLoading,
  fullName,
  email
}: ProfileDetailsProps) => {
  const { toast } = useToast();
  const [fullNameState, setFullNameState] = useState(fullName || profile?.full_name || "");

  const updateProfile = async () => {
    if (!user || !setIsLoading) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullNameState })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Votre profil a été mis à jour.",
    });
  };

  // Simple display for when user is null or only display data is provided
  if (!user || !setIsLoading) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Email</p>
          <p className="text-base">{email || "Non renseigné"}</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Nom complet</p>
          <p className="text-base">{fullName || "Non renseigné"}</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Nom complet</label>
            <Input 
              value={fullNameState} 
              onChange={(e) => setFullNameState(e.target.value)} 
              placeholder="Votre nom complet"
            />
          </div>
          <Button 
            onClick={updateProfile} 
            disabled={isLoading}
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
