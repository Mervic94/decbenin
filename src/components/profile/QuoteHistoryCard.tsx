
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { QuoteRequest } from "@/pages/Profile";
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
  isLoading, 
  searchTerm, 
  setSearchTerm,
  filteredQuotes,
  selectedQuote,
  setSelectedQuote
}: QuoteHistoryCardProps) => {
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
              <QuoteItem 
                key={quote.id} 
                quote={quote} 
                selectedQuote={selectedQuote}
                setSelectedQuote={setSelectedQuote}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
