
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Map from "@/components/Map";
import { QuoteRequest } from "@/pages/Profile";

interface QuoteItemProps {
  quote: QuoteRequest;
  selectedQuote: QuoteRequest | null;
  setSelectedQuote: (quote: QuoteRequest | null) => void;
}

export const QuoteItem = ({ quote, selectedQuote, setSelectedQuote }: QuoteItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
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
  );
};
