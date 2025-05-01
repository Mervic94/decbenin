
import { useState, useEffect } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { History, User as UserIcon } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

// Composants refactorisés
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { QuoteHistoryCard } from "@/components/profile/QuoteHistoryCard";

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
  const [profile, setProfile] = useState<any>(null);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredQuotes = quoteRequests.filter(
    quote => 
      quote.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return null;
  }

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
              <ProfileDetails 
                user={user}
                profile={profile}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
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
