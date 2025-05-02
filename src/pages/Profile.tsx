
import { useState } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { QuoteHistoryCard } from "@/components/profile/QuoteHistoryCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    setIsLoading(true);

    try {
      // In a real implementation, this would upload to Supabase storage
      // For now we just simulate with a timeout
      setTimeout(() => {
        // Create a local URL for the uploaded image
        const objectUrl = URL.createObjectURL(file);
        setAvatarUrl(objectUrl);
        setIsLoading(false);
        
        toast({
          title: "Succès",
          description: "Photo de profil mise à jour avec succès",
        });
      }, 1000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre photo de profil",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // In a real implementation, this would update the Supabase profile
      setTimeout(() => {
        setIsLoading(false);
        setIsEditing(false);
        
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        });
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre profil",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="quotes">Mes Devis</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Photo de Profil</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    {isEditing ? (
                      <div className="w-full">
                        <Label htmlFor="avatar" className="mb-2 block">
                          Changer de photo
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={isLoading}
                        />
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nom Complet</Label>
                          <Input
                            id="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Votre nom complet"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="bg-gray-100"
                          />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                          >
                            Annuler
                          </Button>
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                          >
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ProfileDetails
                          fullName={profile?.full_name || "Non renseigné"}
                          email={user?.email || "Non renseigné"}
                          // We removed phone and address as they don't exist in the Profile type
                        />
                        <div className="flex justify-end mt-4">
                          <Button onClick={() => setIsEditing(true)}>
                            Modifier le profil
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quotes">
              <QuoteHistoryCard />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Profile;
