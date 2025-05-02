
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { QuoteRequest } from "@/types";
import { QuoteItem } from "./QuoteItem";

interface QuoteHistoryCardProps {
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredQuotes: QuoteRequest[];
  selectedQuote: QuoteRequest | null;
  setSelectedQuote: (quote: QuoteRequest | null) => void;
}

export const QuoteHistoryCard = ({ 
  isLoading = false, 
  searchTerm = "", 
  setSearchTerm = () => {},
  filteredQuotes = [],
  selectedQuote = null,
  setSelectedQuote = () => {}
}: Partial<QuoteHistoryCardProps> = {}) => {
  // Mock data for demonstration when no props are provided
  const [mockSearchTerm, setMockSearchTerm] = useState("");
  const [mockSelectedQuote, setMockSelectedQuote] = useState<QuoteRequest | null>(null);
  
  const mockQuotes: QuoteRequest[] = [
    {
      id: "1",
      reference: "REF-20240501",
      created_at: "2024-05-01T10:00:00Z",
      move_date: "2024-06-15T00:00:00Z",
      status: "pending",
      volume: 35,
      pickup_address: "123 Rue du Commerce, Cotonou",
      delivery_address: "456 Avenue des Arts, Cotonou",
      pickup_coordinates: { latitude: 6.3702, longitude: 2.3912 },
      delivery_coordinates: { latitude: 6.3802, longitude: 2.4012 }
    }
  ];

  // Use either provided props or mock data
  const currentSearchTerm = setSearchTerm ? searchTerm : mockSearchTerm;
  const currentSetSearchTerm = setSearchTerm || setMockSearchTerm;
  const currentFilteredQuotes = filteredQuotes.length > 0 ? filteredQuotes : mockQuotes;
  const currentSelectedQuote = setSelectedQuote ? selectedQuote : mockSelectedQuote;
  const currentSetSelectedQuote = setSelectedQuote || setMockSelectedQuote;
  const currentIsLoading = isLoading;

  return (
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
              value={currentSearchTerm}
              onChange={(e) => currentSetSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {currentIsLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : currentFilteredQuotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {currentSearchTerm 
              ? "Aucun résultat trouvé pour votre recherche." 
              : "Vous n'avez pas encore de demande de devis."}
          </div>
        ) : (
          <div className="space-y-4">
            {currentFilteredQuotes.map((quote) => (
              <QuoteItem 
                key={quote.id} 
                quote={quote} 
                selectedQuote={currentSelectedQuote}
                setSelectedQuote={currentSetSelectedQuote}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
