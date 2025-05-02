
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface QuoteFormData {
  pickupAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  moveDate: Date | undefined;
  description: string;
  items: string;
}

interface QuoteRequestModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  quoteFormData: QuoteFormData;
  setQuoteFormData: (quoteFormData: QuoteFormData) => void;
  isSubmitting: boolean;
  handleQuoteSubmit: (formData: any) => Promise<boolean>;
}

export const QuoteRequestModal = ({
  isOpen,
  onOpenChange,
  quoteFormData,
  setQuoteFormData,
  isSubmitting,
  handleQuoteSubmit
}: QuoteRequestModalProps) => {
  const handlePickupAddressChange = (field: keyof typeof quoteFormData.pickupAddress, value: string) => {
    setQuoteFormData({
      ...quoteFormData,
      pickupAddress: {
        ...quoteFormData.pickupAddress,
        [field]: value
      }
    });
  };

  const handleDeliveryAddressChange = (field: keyof typeof quoteFormData.deliveryAddress, value: string) => {
    setQuoteFormData({
      ...quoteFormData,
      deliveryAddress: {
        ...quoteFormData.deliveryAddress,
        [field]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleQuoteSubmit(quoteFormData);
  };

  // Disable past dates for calendar
  const disabledDays = [
    { before: new Date() }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de devis</DialogTitle>
          <DialogDescription>
            Créez une nouvelle demande de devis pour un client
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Pickup Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Adresse de départ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupStreet">Rue</Label>
                <Input
                  id="pickupStreet"
                  value={quoteFormData.pickupAddress.street}
                  onChange={(e) => handlePickupAddressChange("street", e.target.value)}
                  placeholder="123 Rue Principale"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupCity">Ville</Label>
                <Input
                  id="pickupCity"
                  value={quoteFormData.pickupAddress.city}
                  onChange={(e) => handlePickupAddressChange("city", e.target.value)}
                  placeholder="Cotonou"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupZipCode">Code Postal</Label>
                <Input
                  id="pickupZipCode"
                  value={quoteFormData.pickupAddress.zipCode}
                  onChange={(e) => handlePickupAddressChange("zipCode", e.target.value)}
                  placeholder="01 BP 1234"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupCountry">Pays</Label>
                <Input
                  id="pickupCountry"
                  value={quoteFormData.pickupAddress.country}
                  onChange={(e) => handlePickupAddressChange("country", e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Adresse de destination</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryStreet">Rue</Label>
                <Input
                  id="deliveryStreet"
                  value={quoteFormData.deliveryAddress.street}
                  onChange={(e) => handleDeliveryAddressChange("street", e.target.value)}
                  placeholder="456 Avenue Centrale"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryCity">Ville</Label>
                <Input
                  id="deliveryCity"
                  value={quoteFormData.deliveryAddress.city}
                  onChange={(e) => handleDeliveryAddressChange("city", e.target.value)}
                  placeholder="Porto-Novo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryZipCode">Code Postal</Label>
                <Input
                  id="deliveryZipCode"
                  value={quoteFormData.deliveryAddress.zipCode}
                  onChange={(e) => handleDeliveryAddressChange("zipCode", e.target.value)}
                  placeholder="02 BP 5678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryCountry">Pays</Label>
                <Input
                  id="deliveryCountry"
                  value={quoteFormData.deliveryAddress.country}
                  onChange={(e) => handleDeliveryAddressChange("country", e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Moving Date */}
          <div className="space-y-2">
            <Label>Date de déménagement</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !quoteFormData.moveDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {quoteFormData.moveDate ? (
                    format(quoteFormData.moveDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionnez une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={quoteFormData.moveDate}
                  onSelect={(date) => setQuoteFormData({...quoteFormData, moveDate: date})}
                  disabled={disabledDays}
                  locale={fr}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description du déménagement</Label>
            <Textarea
              id="description"
              value={quoteFormData.description}
              onChange={(e) => setQuoteFormData({...quoteFormData, description: e.target.value})}
              placeholder="Décrivez le déménagement (taille de l'appartement, nombre de pièces, etc.)"
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Articles à déménager */}
          <div className="space-y-2">
            <Label htmlFor="items">Articles à déménager (séparés par des virgules)</Label>
            <Textarea
              id="items"
              value={quoteFormData.items}
              onChange={(e) => setQuoteFormData({...quoteFormData, items: e.target.value})}
              placeholder="Canapé, lit, armoire, télévision, etc."
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer la demande"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
