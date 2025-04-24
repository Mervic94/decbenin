
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EstimationResult } from "@/hooks/useQuoteEstimation";

interface EstimationFormProps {
  cartons: number;
  pieces: number;
  volumesSpecifiques: string;
  clientEmail: string;
  estimationLoading: boolean;
  estimationResult: EstimationResult | null;
  onCartonChange: (value: number) => void;
  onPiecesChange: (value: number) => void;
  onVolumesChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EstimationForm = ({
  cartons,
  pieces,
  volumesSpecifiques,
  clientEmail,
  estimationLoading,
  estimationResult,
  onCartonChange,
  onPiecesChange,
  onVolumesChange,
  onEmailChange,
  onSubmit,
}: EstimationFormProps) => {
  return (
    <div className="my-10 p-4 rounded bg-[#F1F0FB] shadow-inner">
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
            onChange={e => onCartonChange(Number(e.target.value))}
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
            onChange={e => onPiecesChange(Number(e.target.value))}
            placeholder="0"
            disabled={estimationLoading}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Volumes spécifiques (m³, séparés par des virgules)</Label>
          <Input
            value={volumesSpecifiques}
            onChange={e => onVolumesChange(e.target.value)}
            placeholder="ex: 1.5, 2.0, 0.8"
            disabled={estimationLoading}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Votre email pour recevoir le devis PDF</Label>
          <Input
            type="email"
            value={clientEmail}
            onChange={e => onEmailChange(e.target.value)}
            placeholder="ex : client@example.com"
            disabled={estimationLoading}
            required
          />
        </div>
      </div>
      <Button
        type="button"
        onClick={onSubmit}
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
