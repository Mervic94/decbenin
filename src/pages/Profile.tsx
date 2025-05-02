
import { useState, useEffect, ChangeEvent } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { History, User as UserIcon, Pencil, Save, ChevronLeft, Camera, X } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

// Composants refactorisés
import { QuoteHistoryCard } from "@/components/profile/QuoteHistoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export interface QuoteRequest {
  id: string;
  created_at: string;
  pickup_address: string;
  delivery_address: string;
  pickup_coordinates: { latitude: number, longitude: number };
  delivery_coordinates: { latitude: number, longitude: number };
  move_date: string;
  status: string;
  volume: number;
  reference: string;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          fullName: data.full_name || "",
          email: user.email || "",
          phone: data.phone || "",
          address: data.address || ""
        });
      }
    };

    const fetchQuoteRequests = async () => {
      // This is a placeholder - in a real app, you would have a quotes table
      // For demo purposes, we're creating mock data
      const mockQuotes = [
        {
          id: "1",
          created_at: new Date().toISOString(),
          pickup_address: "123 Rue du Commerce, Cotonou",
          delivery_address: "456 Avenue des Arts, Cotonou",
          pickup_coordinates: { latitude: 6.3702, longitude: 2.3912 },
          delivery_coordinates: { latitude: 6.3802, longitude: 2.4112 },
          move_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          volume: 12.5,
          reference: "DEV-230501-4582"
        },
        {
          id: "2",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          pickup_address: "789 Boulevard de la Marina, Cotonou",
          delivery_address: "101 Rue des Palmiers, Porto-Novo",
          pickup_coordinates: { latitude: 6.3632, longitude: 2.3832 },
          delivery_coordinates: { latitude: 6.4968, longitude: 2.6284 },
          move_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          volume: 8.2,
          reference: "DEV-230401-1234"
        }
      ];
      
      setQuoteRequests(mockQuotes);
      setIsLoading(false);
    };

    fetchProfile();
    fetchQuoteRequests();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatarPreview = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // Update profile information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address
        })
        .eq("id", user?.id);
      
      if (profileError) throw profileError;
      
      // Handle avatar upload if there is a new file
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        
        // In a real implementation, you would upload to Supabase storage:
        // const { error: uploadError } = await supabase.storage
        //   .from('avatars')
        //   .upload(fileName, avatarFile);
        
        // if (uploadError) throw uploadError;
        
        // Get public URL
        // const { data: publicURL } = supabase.storage
        //   .from('avatars')
        //   .getPublicUrl(fileName);
        
        // Update profile with new avatar URL
        // await supabase
        //   .from('profiles')
        //   .update({ avatar_url: publicURL.publicUrl })
        //   .eq('id', user?.id);
      }
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          // avatar_url: avatarFile ? newAvatarUrl : profile.avatar_url
        });
      }
      
      // Exit editing mode
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations personnelles ont été mises à jour avec succès",
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuotes = quoteRequests.filter(
    quote => 
      quote.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Profil
              </TabsTrigger>
              <TabsTrigger value="quote-history" className="flex items-center gap-2">
                <History className="h-4 w-4" /> Historique des devis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>Gérez vos informations personnelles</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Modifier
                      </Button>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Avatar section */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          {avatarPreview ? (
                            <AvatarImage src={avatarPreview} alt="Avatar preview" />
                          ) : profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                          ) : (
                            <AvatarFallback className="text-xl">
                              {getInitials(profile?.full_name || user.email)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        {isEditing && (
                          <div className="absolute -bottom-1 -right-1">
                            {avatarPreview ? (
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="h-8 w-8 rounded-full"
                                onClick={removeAvatarPreview}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Label 
                                htmlFor="avatar-upload" 
                                className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer"
                              >
                                <Camera className="h-4 w-4" />
                                <Input 
                                  id="avatar-upload" 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden"
                                  onChange={handleAvatarChange}
                                />
                              </Label>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-center sm:text-left">
                        <h3 className="font-medium text-lg">{profile?.full_name || "Utilisateur"}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.role === "agent" ? "Agent MoveIt" : 
                           user.role === "admin" ? "Administrateur" : "Utilisateur"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Profile form */}
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Nom complet</Label>
                          <Input 
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Votre nom complet"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            value={formData.email}
                            disabled={true} // Email can't be changed here
                            placeholder="votre.email@example.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Votre numéro de téléphone"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Input 
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Votre adresse"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                {isEditing && (
                  <CardFooter className="flex justify-between border-t pt-5">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          fullName: profile?.full_name || "",
                          email: user.email || "",
                          phone: profile?.phone || "",
                          address: profile?.address || ""
                        });
                        setAvatarPreview(null);
                        setAvatarFile(null);
                      }}
                      disabled={isLoading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" /> Annuler
                    </Button>
                    
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? "Enregistrement..." : (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Enregistrer
                        </>
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="quote-history">
              <QuoteHistoryCard 
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredQuotes={filteredQuotes}
                selectedQuote={selectedQuote}
                setSelectedQuote={setSelectedQuote}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Profile;
