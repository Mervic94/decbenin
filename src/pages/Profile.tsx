
import { useState, useEffect } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Search, History, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Map";

interface QuoteRequest {
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
  const [fullName, setFullName] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  
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
        setFullName(data.full_name || "");
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

  const filteredQuotes = quoteRequests.filter(
    quote => 
      quote.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
            </TabsContent>
            
            <TabsContent value="quote-history">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des demandes de devis</CardTitle>
                  <CardDescription>Consultez vos demandes de devis précédentes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Rechercher par référence ou adresse..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-8">Chargement...</div>
                  ) : filteredQuotes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm 
                        ? "Aucun résultat trouvé pour votre recherche." 
                        : "Vous n'avez pas encore de demande de devis."}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredQuotes.map((quote) => (
                        <Card key={quote.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div 
                              className="p-4 cursor-pointer"
                              onClick={() => setSelectedQuote(selectedQuote?.id === quote.id ? null : quote)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-primary">{quote.reference}</p>
                                  <p className="text-sm text-gray-600">
                                    Date de demande: {formatDate(quote.created_at)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Date de déménagement: {formatDate(quote.move_date)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    quote.status === 'completed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {quote.status === 'completed' ? 'Complété' : 'En attente'}
                                  </span>
                                  <p className="text-sm mt-1">Volume: {quote.volume} m³</p>
                                </div>
                              </div>
                            </div>
                            
                            {selectedQuote?.id === quote.id && (
                              <div className="border-t p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Lieu de départ</h4>
                                    <p className="text-sm mb-2">{quote.pickup_address}</p>
                                    <div className="h-[200px]">
                                      <Map 
                                        latitude={quote.pickup_coordinates.latitude}
                                        longitude={quote.pickup_coordinates.longitude}
                                        height="200px"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Lieu d'arrivée</h4>
                                    <p className="text-sm mb-2">{quote.delivery_address}</p>
                                    <div className="h-[200px]">
                                      <Map 
                                        latitude={quote.delivery_coordinates.latitude}
                                        longitude={quote.delivery_coordinates.longitude}
                                        height="200px"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Profile;
