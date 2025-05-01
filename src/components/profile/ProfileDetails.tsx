
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
  user: any;
  profile: any;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const ProfileDetails = ({ user, profile, isLoading, setIsLoading }: ProfileDetailsProps) => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || "");

  const updateProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
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
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
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
