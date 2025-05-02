
import { Layout, PageContainer } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

const ChecklistDemenagement = () => {
  return (
    <Layout>
      <PageContainer>
        <div className="py-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Checklist de Déménagement</h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Suivez cette liste pour organiser votre déménagement sans stress
          </p>
          
          <div className="space-y-8">
            <ChecklistSection 
              title="2 mois avant le déménagement"
              items={[
                "Faire l'inventaire des biens à déménager",
                "Demander des devis à plusieurs entreprises de déménagement",
                "Vérifier la date d'expiration de vos documents importants",
                "Commencer à trier vos affaires et vous débarrasser de ce dont vous n'avez plus besoin"
              ]}
            />
            
            <ChecklistSection 
              title="1 mois avant le déménagement"
              items={[
                "Confirmer la date de déménagement avec l'entreprise choisie",
                "Notifier votre changement d'adresse à la poste et autres organismes",
                "Commencer à emballer les objets non essentiels",
                "Prévoir la garde des enfants et animaux le jour du déménagement"
              ]}
            />
            
            <ChecklistSection 
              title="2 semaines avant le déménagement"
              items={[
                "Confirmer les modalités de remise des clés avec le propriétaire",
                "Organiser le transfert des services (électricité, eau, internet)",
                "Emballer la majorité de vos affaires",
                "Prévoir un kit de première nécessité pour le jour J"
              ]}
            />
            
            <ChecklistSection 
              title="Le jour du déménagement"
              items={[
                "Être présent pour accueillir les déménageurs",
                "Vérifier que rien n'est oublié",
                "Relever les compteurs",
                "Remettre les clés au propriétaire ou à l'agence"
              ]}
            />
            
            <ChecklistSection 
              title="Après le déménagement"
              items={[
                "Déballer les cartons par ordre de priorité",
                "Vérifier le bon fonctionnement des installations",
                "Rencontrer vos nouveaux voisins",
                "Mettre à jour vos documents administratifs avec la nouvelle adresse"
              ]}
            />
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

interface ChecklistSectionProps {
  title: string;
  items: string[];
}

const ChecklistSection = ({ title, items }: ChecklistSectionProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <Separator className="mb-4" />
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ChecklistDemenagement;
