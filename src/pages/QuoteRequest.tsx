
import { useState } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { Address } from "@/types";

const QuoteRequest = () => {
  const { isAuthenticated } = useAuth();
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/quote" } });
  }

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
        navigate("/dashboard");
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

  // Disable past dates for calendar
  const disabledDays = [
    { before: new Date() }
  ];

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Demande de Devis</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Détails du déménagement</CardTitle>
              <CardDescription>
                Fournissez-nous les informations nécessaires pour vous établir un devis
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Pickup Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Adresse de départ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupStreet">Rue</Label>
                      <Input
                        id="pickupStreet"
                        value={pickupAddress.street}
                        onChange={(e) => handlePickupAddressChange("street", e.target.value)}
                        placeholder="123 Rue Principale"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupCity">Ville</Label>
                      <Input
                        id="pickupCity"
                        value={pickupAddress.city}
                        onChange={(e) => handlePickupAddressChange("city", e.target.value)}
                        placeholder="Cotonou"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupZipCode">Code Postal</Label>
                      <Input
                        id="pickupZipCode"
                        value={pickupAddress.zipCode}
                        onChange={(e) => handlePickupAddressChange("zipCode", e.target.value)}
                        placeholder="01 BP 1234"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupCountry">Pays</Label>
                      <Input
                        id="pickupCountry"
                        value={pickupAddress.country}
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
                        value={deliveryAddress.street}
                        onChange={(e) => handleDeliveryAddressChange("street", e.target.value)}
                        placeholder="456 Avenue Centrale"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryCity">Ville</Label>
                      <Input
                        id="deliveryCity"
                        value={deliveryAddress.city}
                        onChange={(e) => handleDeliveryAddressChange("city", e.target.value)}
                        placeholder="Porto-Novo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryZipCode">Code Postal</Label>
                      <Input
                        id="deliveryZipCode"
                        value={deliveryAddress.zipCode}
                        onChange={(e) => handleDeliveryAddressChange("zipCode", e.target.value)}
                        placeholder="02 BP 5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryCountry">Pays</Label>
                      <Input
                        id="deliveryCountry"
                        value={deliveryAddress.country}
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
                          !moveDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {moveDate ? (
                          format(moveDate, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionnez une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={moveDate}
                        onSelect={setMoveDate}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre déménagement (taille de l'appartement, nombre de pièces, etc.)"
                    className="min-h-[100px]"
                  />
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <Label htmlFor="items">Articles à déménager (séparés par des virgules)</Label>
                  <Textarea
                    id="items"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    placeholder="Canapé, lit, armoire, télévision, etc."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Soumission en cours..." : "Soumettre la demande"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default QuoteRequest;
