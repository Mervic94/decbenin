
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@/types";
import { AddressForm } from "@/components/quote/AddressForm";
import { QuoteDateSelector } from "@/components/quote/QuoteDateSelector";
import { QuoteEstimationForm } from "@/components/quote/QuoteEstimationForm";
import { useRequests } from "@/context/RequestContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

interface QuoteFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
}

export function QuoteForm({ isModal = false, onSuccess }: QuoteFormProps) {
  const { createRequest } = useRequests();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [pickupAddress, setPickupAddress] = useState<Address>({
    street: "",
    city: "",
    zipCode: "",
    country: "Bénin",
  });
  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    street: "",
    city: "",
    zipCode: "",
    country: "Bénin",
  });
  const [moveDate, setMoveDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickupAddressChange = (field: keyof Address, value: string) => {
    setPickupAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeliveryAddressChange = (field: keyof Address, value: string) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupAddress.street || !pickupAddress.city || !pickupAddress.zipCode) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs de l'adresse de départ",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs de l'adresse de destination",
        variant: "destructive",
      });
      return;
    }

    if (!moveDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date de déménagement",
        variant: "destructive",
      });
      return;
    }

    if (!description) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une description de votre déménagement",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsList = items.split(',').map(item => item.trim()).filter(Boolean);
      
      const success = await createRequest(
        pickupAddress,
        deliveryAddress,
        moveDate,
        description,
        itemsList
      );

      if (success) {
        toast({
          title: "Demande soumise",
          description: "Votre demande de devis a été soumise avec succès",
        });
        
        if (isModal && onSuccess) {
          onSuccess();
        } else {
          navigate("/dashboard");
        }
      } else {
        toast({
          title: "Échec",
          description: "Une erreur est survenue lors de la soumission de votre demande",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre demande",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        {/* Pickup Address */}
        <AddressForm 
          title="Adresse de départ"
          address={pickupAddress}
          handleAddressChange={handlePickupAddressChange}
        />

        {/* Delivery Address */}
        <AddressForm 
          title="Adresse de destination"
          address={deliveryAddress}
          handleAddressChange={handleDeliveryAddressChange}
        />

        {/* Moving Date */}
        <QuoteDateSelector 
          moveDate={moveDate}
          setMoveDate={setMoveDate}
        />

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description du déménagement</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre déménagement (taille de l'appartement, nombre de pièces, etc.)"
            className="min-h-[100px]"
          />
        </div>

        {/* Articles à déménager (séparés par des virgules) */}
        <div className="space-y-2">
          <Label htmlFor="items">Articles à déménager (séparés par des virgules)</Label>
          <Textarea
            id="items"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Canapé, lit, armoire, télévision, etc."
          />
        </div>

        {/* Estimation Devis Section */}
        <QuoteEstimationForm />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Soumission en cours..." : "Soumettre la demande"}
        </Button>
      </CardFooter>
    </form>
  );
}
