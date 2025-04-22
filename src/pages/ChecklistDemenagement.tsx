
import React, { useState } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar, Printer, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 3 mois avant
  { id: "1", text: "Faire l'état des lieux de ce que vous souhaitez déménager", checked: false, category: "3-mois" },
  { id: "2", text: "Demander des devis à plusieurs entreprises de déménagement", checked: false, category: "3-mois" },
  { id: "3", text: "Résilier ou transférer vos contrats (électricité, gaz, internet, etc.)", checked: false, category: "3-mois" },
  { id: "4", text: "Commencer à trier vos affaires et vous débarrasser de ce dont vous n'avez plus besoin", checked: false, category: "3-mois" },
  
  // 1 mois avant
  { id: "5", text: "Confirmer la date de déménagement avec l'entreprise choisie", checked: false, category: "1-mois" },
  { id: "6", text: "Prévenir votre propriétaire actuel de votre départ", checked: false, category: "1-mois" },
  { id: "7", text: "Commander des cartons et du matériel d'emballage", checked: false, category: "1-mois" },
  { id: "8", text: "Commencer à emballer les objets que vous utilisez rarement", checked: false, category: "1-mois" },
  { id: "9", text: "Effectuer votre changement d'adresse auprès des services administratifs", checked: false, category: "1-mois" },
  
  // 2 semaines avant
  { id: "10", text: "Confirmer votre nouvelle adresse auprès de la poste pour le transfert du courrier", checked: false, category: "2-semaines" },
  { id: "11", text: "Prendre des photos de vos meubles démontés pour faciliter le remontage", checked: false, category: "2-semaines" },
  { id: "12", text: "Emballer la majorité de vos affaires", checked: false, category: "2-semaines" },
  { id: "13", text: "Prévoir un kit de première nécessité pour le jour J", checked: false, category: "2-semaines" },
  
  // La dernière semaine
  { id: "14", text: "Finaliser l'emballage de vos affaires", checked: false, category: "derniere-semaine" },
  { id: "15", text: "Dégivrer le réfrigérateur et le congélateur", checked: false, category: "derniere-semaine" },
  { id: "16", text: "Préparer les documents importants à garder avec vous", checked: false, category: "derniere-semaine" },
  { id: "17", text: "Remplir un formulaire de changement d'adresse auprès de la poste", checked: false, category: "derniere-semaine" },
  
  // Le jour J
  { id: "18", text: "Relever les compteurs dans l'ancien et le nouveau logement", checked: false, category: "jour-j" },
  { id: "19", text: "Vérifier que rien n'a été oublié dans l'ancien logement", checked: false, category: "jour-j" },
  { id: "20", text: "Remettre les clés à votre ancien propriétaire", checked: false, category: "jour-j" },
  { id: "21", text: "Superviser le chargement et le déchargement des meubles", checked: false, category: "jour-j" },
];

const ChecklistDemenagement = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);
  
  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const calculateProgress = () => {
    const totalItems = checklist.length;
    const checkedItems = checklist.filter(item => item.checked).length;
    return (checkedItems / totalItems) * 100;
  };
  
  const progress = calculateProgress();
  
  const getItemsByCategory = (category: string) => {
    return checklist.filter(item => item.category === category);
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Checklist de déménagement</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Suivez ces étapes pour un déménagement sans stress
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Votre progression</h2>
              <span className="font-bold text-xl">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Button onClick={() => navigate("/quote")} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Planifier votre déménagement
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Imprimer la checklist
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Télécharger en PDF
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="3-mois" className="bg-white rounded-lg shadow-sm border mb-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <h3 className="text-lg font-semibold">3 mois avant le déménagement</h3>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {getItemsByCategory("3-mois").map(item => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={`check-${item.id}`} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label 
                        htmlFor={`check-${item.id}`} 
                        className={`text-base ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="1-mois" className="bg-white rounded-lg shadow-sm border mb-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <h3 className="text-lg font-semibold">1 mois avant le déménagement</h3>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {getItemsByCategory("1-mois").map(item => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={`check-${item.id}`} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label 
                        htmlFor={`check-${item.id}`} 
                        className={`text-base ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="2-semaines" className="bg-white rounded-lg shadow-sm border mb-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <h3 className="text-lg font-semibold">2 semaines avant le déménagement</h3>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {getItemsByCategory("2-semaines").map(item => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={`check-${item.id}`} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label 
                        htmlFor={`check-${item.id}`} 
                        className={`text-base ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="derniere-semaine" className="bg-white rounded-lg shadow-sm border mb-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <h3 className="text-lg font-semibold">La dernière semaine</h3>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {getItemsByCategory("derniere-semaine").map(item => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={`check-${item.id}`} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label 
                        htmlFor={`check-${item.id}`} 
                        className={`text-base ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="jour-j" className="bg-white rounded-lg shadow-sm border mb-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <h3 className="text-lg font-semibold">Le jour J</h3>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {getItemsByCategory("jour-j").map(item => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={`check-${item.id}`} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label 
                        htmlFor={`check-${item.id}`} 
                        className={`text-base ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="bg-muted rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-3">Besoin d'aide pour votre déménagement ?</h3>
            <p className="mb-4">
              Déménagement Express Cotonou peut vous aider à chaque étape de votre déménagement.
              Nos services professionnels vous permettent de vous concentrer sur l'essentiel.
            </p>
            <Button onClick={() => navigate("/quote")} size="lg">
              Demander un devis gratuit
            </Button>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default ChecklistDemenagement;
