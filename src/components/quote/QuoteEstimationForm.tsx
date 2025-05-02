
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQuoteEstimation } from "@/hooks/useQuoteEstimation";
import { useToast } from "@/hooks/use-toast";

interface QuoteEstimationFormProps {
  onSubmit?: (estimationResult: any) => void;
}

export const QuoteEstimationForm = ({ onSubmit }: QuoteEstimationFormProps) => {
  const [cartons, setCartons] = useState(0);
  const [pieces, setPieces] = useState(0);
  const [volumesSpecifiques, setVolumesSpecifiques] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const estimationSectionRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const {
    loading: estimationLoading,
    result: estimationResult,
    sendEstimation,
  } = useQuoteEstimation();

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

    const result = await sendEstimation({
      cartons,
      pieces,
      volumesSpecifiques,
      clientEmail,
    });
    
    if (onSubmit) {
      onSubmit(result);
    }
    
    // Scroll feedback into view if needed
    setTimeout(() => estimationSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  };

  return (
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
  );
};
