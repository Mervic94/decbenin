
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

export function VolumeSimulator() {
  const [cartons, setCartons] = useState('');
  const [pieces, setPieces] = useState('');
  const [resultat, setResultat] = useState<null | {
    volume: number;
    coutCFA: number;
    coutEUR: number;
    coutUSD: number;
  }>(null);

  const calculer = () => {
    const Ncartons = parseInt(cartons) || 0;
    const Npieces = parseInt(pieces) || 0;
    const volume_par_carton = 0.05;
    const volume_par_piece = 10;
    const volume_total = (Ncartons * volume_par_carton) + (Npieces * volume_par_piece);

    const tarif_CFA = 15000;
    const tarif_EUR = 22;
    const tarif_USD = 24;

    setResultat({
      volume: volume_total,
      coutCFA: volume_total * tarif_CFA,
      coutEUR: volume_total * tarif_EUR,
      coutUSD: volume_total * tarif_USD
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-demenagement-red shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-demenagement-red">
        <ClipboardList className="h-5 w-5" /> Estimation rapide du volume
      </h2>
      <p className="mb-4 text-muted-foreground text-sm">
        Listez rapidement le nombre de cartons/pièces pour avoir une idée du volume à déménager.
      </p>
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex flex-col">
          <label className="font-medium mb-1">Nombre de cartons</label>
          <input
            type="number"
            min="0"
            value={cartons}
            onChange={e => setCartons(e.target.value)}
            placeholder="ex: 15"
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium mb-1">Nombre de meubles</label>
          <input
            type="number"
            min="0"
            value={pieces}
            onChange={e => setPieces(e.target.value)}
            placeholder="ex: 5"
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <Button type="button" className="bg-primary mt-3 md:mt-0" onClick={calculer}>
          Estimer (simulateur illustratif)
        </Button>
      </div>
      <p className="text-xs mt-2 text-muted-foreground">Pour un devis précis, remplissez le formulaire complet.</p>
      {resultat && (
        <div className="mt-4 border rounded bg-demenagement-red/10 p-4 text-demenagement-red">
          <div className="font-semibold mb-1">Volume estimé : {resultat.volume.toFixed(2)} m³</div>
          <div className="mb-1">Estimation du coût :</div>
          <ul className="space-y-0.5 text-sm">
            <li>• {resultat.coutCFA.toLocaleString()} FCA</li>
            <li>• {resultat.coutEUR.toFixed(2)} €</li>
            <li>• {resultat.coutUSD.toFixed(2)} $</li>
          </ul>
        </div>
      )}
    </div>
  );
}
