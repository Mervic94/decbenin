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
import { useQuoteEstimation } from "@/hooks/useQuoteEstimation";
import { useRef } from "react";
import Map from "@/components/Map";

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
  const [cartons, setCartons] = useState(0);
  const [pieces, setPieces] = useState(0);
  const [volumesSpecifiques, setVolumesSpecifiques] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const estimationSectionRef = useRef<HTMLDivElement | null>(null);

  const {
    loading: estimationLoading,
    result: estimationResult,
    sendEstimation,
  } = useQuoteEstimation();

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

  const handleEstimation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (cartons < 0 || pieces < 0) {
      toast({
        title: "Erreur",
        description: "Le nombre de cartons et pièces doit être positif.",
        variant: "destructive",
      });
      return;
    }
    if (!clientEmail || !clientEmail.includes("@")) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un email valide pour recevoir le devis.",
        variant: "destructive",
      });
      return;
    }

    await sendEstimation({
      cartons,
      pieces,
      volumesSpecifiques,
      clientEmail,
    });
    // Scroll feedback into view if needed
    setTimeout(() => estimationSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
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
                  <div className="mt-4">
                    <Map />
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
                  <div className="mt-4">
                    <Map />
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
                <div className="my-10 p-4 rounded bg-[#F1F0FB] shadow-inner" ref={estimationSectionRef}>
                  <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                    <span role="img" aria-label="devis">📦</span> Estimer et Recevoir votre devis personnalisé
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label>Nombre de cartons</Label>
                      <Input
                        type="number"
                        min={0}
                        value={cartons}
                        onChange={e => setCartons(Number(e.target.value))}
                        placeholder="0"
                        disabled={estimationLoading}
                      />
                    </div>
                    <div>
                      <Label>Nombre de pièces</Label>
                      <Input
                        type="number"
                        min={0}
                        value={pieces}
                        onChange={e => setPieces(Number(e.target.value))}
                        placeholder="0"
                        disabled={estimationLoading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Volumes spécifiques (m³, séparés par des virgules)</Label>
                      <Input
                        value={volumesSpecifiques}
                        onChange={e => setVolumesSpecifiques(e.target.value)}
                        placeholder="ex: 1.5, 2.0, 0.8"
                        disabled={estimationLoading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Votre email pour recevoir le devis PDF</Label>
                      <Input
                        type="email"
                        value={clientEmail}
                        onChange={e => setClientEmail(e.target.value)}
                        placeholder="ex : client@example.com"
                        disabled={estimationLoading}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleEstimation}
                    disabled={estimationLoading}
                    className="w-full"
                  >
                    {estimationLoading ? "Calcul & envoi en cours..." : "Calculer et envoyer le devis"}
                  </Button>
                  {estimationResult && (
                    <div className={`mt-4 p-3 rounded text-center ${estimationResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                      {estimationResult.message}
                    </div>
                  )}
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
