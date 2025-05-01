
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, Calculator } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const defaultItems = [
  { name: "Réfrigérateur", volume: 1.0 },
  { name: "Machine à laver", volume: 0.5 },
  { name: "Canapé 2 places", volume: 1.5 },
  { name: "Canapé 3 places", volume: 2.0 },
  { name: "Table à manger", volume: 0.8 },
  { name: "Chaise", volume: 0.2 },
  { name: "Lit simple", volume: 1.0 },
  { name: "Lit double", volume: 1.8 },
  { name: "Armoire", volume: 2.0 },
  { name: "Commode", volume: 0.6 },
  { name: "Bureau", volume: 0.7 },
  { name: "Télévision", volume: 0.3 },
  { name: "Carton standard", volume: 0.05 }
];

interface SelectedItem {
  name: string;
  volume: number;
  quantity: number;
}

export function VolumeSimulator() {
  const [cartons, setCartons] = useState('');
  const [pieces, setPieces] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [resultat, setResultat] = useState<null | {
    volume: number;
    coutCFA: number;
    coutEUR: number;
    coutUSD: number;
    reference: string;
  }>(null);

  const addItemToSelection = (item: { name: string, volume: number }) => {
    const existing = selectedItems.find(i => i.name === item.name);
    if (existing) {
      setSelectedItems(
        selectedItems.map(i => i.name === item.name 
          ? { ...i, quantity: i.quantity + 1 }
          : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const updateItemQuantity = (name: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter(item => item.name !== name));
    } else {
      setSelectedItems(
        selectedItems.map(item => 
          item.name === name ? { ...item, quantity } : item
        )
      );
    }
  };

  const generateReference = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DEV-${year}${month}${day}-${random}`;
  };

  const calculer = () => {
    const Ncartons = parseInt(cartons) || 0;
    const Npieces = parseInt(pieces) || 0;
    const volume_par_carton = 0.05;
    const volume_par_piece = 10;
    
    // Calculer le volume des éléments sélectionnés
    const volume_elements_selectionnes = selectedItems.reduce(
      (total, item) => total + (item.volume * item.quantity), 0
    );
    
    const volume_total = (Ncartons * volume_par_carton) + 
      (Npieces * volume_par_piece) + 
      volume_elements_selectionnes;

    const tarif_CFA = 15000;
    const tarif_EUR = 22;
    const tarif_USD = 24;

    setResultat({
      volume: volume_total,
      coutCFA: volume_total * tarif_CFA,
      coutEUR: volume_total * tarif_EUR,
      coutUSD: volume_total * tarif_USD,
      reference: generateReference()
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-demenagement-red shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-demenagement-red">
        <Calculator className="h-5 w-5" /> Calculateur de volume professionnel
      </h2>
      <p className="mb-4 text-muted-foreground text-sm">
        Estimez précisément le volume de votre déménagement selon les normes internationales.
      </p>
      
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Nombre de cartons</label>
            <input
              type="number"
              min="0"
              value={cartons}
              onChange={e => setCartons(e.target.value)}
              placeholder="ex: 15"
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Nombre de meubles génériques</label>
            <input
              type="number"
              min="0"
              value={pieces}
              onChange={e => setPieces(e.target.value)}
              placeholder="ex: 5"
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Éléments spécifiques</label>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowItemModal(true)}
              className="border h-[42px]"
            >
              Sélectionner des éléments ({selectedItems.reduce((total, item) => total + item.quantity, 0)})
            </Button>
          </div>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="mt-2">
            <h3 className="font-medium mb-2">Éléments sélectionnés:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <div key={item.name} className="flex items-center bg-gray-100 p-2 rounded">
                  <span>{item.name} ({item.quantity})</span>
                  <button 
                    onClick={() => updateItemQuantity(item.name, item.quantity - 1)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Button 
          type="button" 
          className="bg-primary mt-3" 
          onClick={calculer}
        >
          Calculer l'estimation
        </Button>
      </div>

      <p className="text-xs mt-2 text-muted-foreground">Pour un devis précis, remplissez le formulaire complet.</p>
      
      {resultat && (
        <div className="mt-4 border rounded bg-demenagement-red/10 p-4 text-demenagement-red">
          <div className="font-semibold mb-1">Volume estimé : {resultat.volume.toFixed(2)} m³</div>
          <div className="font-medium mb-1">Référence : {resultat.reference}</div>
          <div className="mb-1">Estimation du coût :</div>
          <ul className="space-y-0.5 text-sm">
            <li>• {resultat.coutCFA.toLocaleString()} FCA</li>
            <li>• {resultat.coutEUR.toFixed(2)} €</li>
            <li>• {resultat.coutUSD.toFixed(2)} $</li>
          </ul>
        </div>
      )}

      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Sélectionner des éléments</h3>
            <ScrollArea className="h-64 pr-4">
              <div className="grid grid-cols-1 gap-2">
                {defaultItems.map((item) => (
                  <Button 
                    key={item.name} 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => addItemToSelection(item)}
                  >
                    {item.name} ({item.volume} m³)
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowItemModal(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
