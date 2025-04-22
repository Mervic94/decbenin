
import React from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Truck, 
  Package, 
  Clock, 
  FileText, 
  Home, 
  Mail, 
  Phone, 
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrganiserDemenagement = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Comment organiser son déménagement</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Guide complet pour vous aider à planifier et organiser votre déménagement étape par étape
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Planification</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez à planifier votre déménagement au moins 3 mois à l'avance pour éviter le stress.
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate("/checklist-demenagement")}>
                  Voir la checklist
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transport</h3>
                <p className="text-muted-foreground mb-4">
                  Choisissez le bon moyen de transport pour vos biens selon vos besoins et votre budget.
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate("/services")}>
                  Voir nos services
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Emballage</h3>
                <p className="text-muted-foreground mb-4">
                  Apprenez les techniques d'emballage professionnelles pour protéger vos objets.
                </p>
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  Conseils d'emballage
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="avant" className="mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="avant">Avant le déménagement</TabsTrigger>
              <TabsTrigger value="pendant">Pendant le déménagement</TabsTrigger>
              <TabsTrigger value="apres">Après le déménagement</TabsTrigger>
            </TabsList>
            
            <TabsContent value="avant" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Avant le déménagement</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  3 mois avant
                </h3>
                <ul className="list-disc pl-10 space-y-2">
                  <li>Fixez votre date de déménagement</li>
                  <li>Commencez à obtenir des devis d'entreprises de déménagement</li>
                  <li>Donnez votre préavis à votre propriétaire actuel</li>
                  <li>Faites l'inventaire de vos biens</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  2 mois avant
                </h3>
                <ul className="list-disc pl-10 space-y-2">
                  <li>Choisissez votre entreprise de déménagement et réservez la date</li>
                  <li>Commencez à trier vos affaires (à garder, à donner, à jeter)</li>
                  <li>Recherchez des fournitures d'emballage</li>
                  <li>Informez les écoles, employeurs et autres organismes de votre changement d'adresse</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  1 mois avant
                </h3>
                <ul className="list-disc pl-10 space-y-2">
                  <li>Commencez à emballer les objets que vous utilisez rarement</li>
                  <li>Transférez ou résiliez vos contrats (électricité, eau, internet, etc.)</li>
                  <li>Mettez à jour votre adresse pour vos services postaux</li>
                  <li>Préparez un dossier avec tous vos documents importants</li>
                </ul>
              </div>
              
              <Button onClick={() => navigate("/checklist-demenagement")} className="mt-4">
                Voir la checklist complète
              </Button>
            </TabsContent>
            
            <TabsContent value="pendant" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Pendant le déménagement</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Conseils pour le jour J</h3>
                <ul className="list-disc pl-10 space-y-2">
                  <li>Soyez prêt avant l'arrivée des déménageurs</li>
                  <li>Gardez vos objets de valeur et documents importants avec vous</li>
                  <li>Préparez des boissons et des collations pour tout le monde</li>
                  <li>Prenez des photos de vos compteurs dans l'ancien et le nouveau logement</li>
                  <li>Vérifiez chaque pièce avant de partir définitivement</li>
                  <li>Supervisez le chargement et le déchargement des meubles</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Conseils supplémentaires</h3>
                <ul className="list-disc pl-10 space-y-2">
                  <li>Gardez un "kit de survie" à portée de main (médicaments, produits d'hygiène, etc.)</li>
                  <li>Préparez un sac avec des vêtements pour les premiers jours</li>
                  <li>Prenez des photos de vos objets et meubles pour documenter leur état</li>
                  <li>Prenez le temps de faire une pause et de vous hydrater régulièrement</li>
                </ul>
              </div>
              
              <Button onClick={() => navigate("/quote")} className="mt-4">
                Réserver nos services
              </Button>
            </TabsContent>
            
            <TabsContent value="apres" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Après le déménagement</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Les premières actions</h3>
                <ul className="list-disc pl-10 space-y-2">
                  <li>Vérifiez que tous vos biens sont arrivés en bon état</li>
                  <li>Installez les meubles essentiels (lit, canapé, table, etc.)</li>
                  <li>Vérifiez que l'électricité, l'eau et le chauffage fonctionnent</li>
                  <li>Débranchez le réfrigérateur pendant quelques heures avant de le brancher</li>
                  <li>Nettoyez les pièces essentielles (cuisine, salle de bain, chambre)</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">La première semaine</h3>
                <ul className="list-disc pl-10 space-y-2">
                  <li>Rencontrez vos nouveaux voisins</li>
                  <li>Localisez les commerces et services de proximité</li>
                  <li>Vérifiez que votre courrier est bien redirigé</li>
                  <li>Inscrivez-vous sur les listes électorales de votre nouvelle commune</li>
                  <li>Mettez à jour votre assurance habitation</li>
                </ul>
              </div>
              
              <Button variant="outline" onClick={() => navigate("/contact")} className="mt-4">
                Nous contacter pour assistance
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Documents à prévoir
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contrat de location ou acte de vente</li>
                <li>État des lieux (entrée/sortie)</li>
                <li>Factures des services (électricité, eau, etc.)</li>
                <li>Assurance habitation</li>
                <li>Certificats de scolarité des enfants</li>
                <li>Documents d'identité</li>
                <li>Carnet de santé</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Home className="mr-2 h-5 w-5 text-primary" />
                Changements d'adresse
              </h3>
              <p className="mb-4">N'oubliez pas de signaler votre changement d'adresse à :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>La poste (pour le transfert du courrier)</li>
                <li>Votre banque</li>
                <li>Votre employeur</li>
                <li>Les écoles</li>
                <li>Les impôts et administrations</li>
                <li>Les fournisseurs d'énergie et de services</li>
                <li>Les abonnements (magazines, box internet, etc.)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary text-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-3">Besoin d'aide pour organiser votre déménagement ?</h2>
                <p className="mb-4">
                  Nos experts en déménagement peuvent vous accompagner tout au long du processus.
                  Contactez-nous dès aujourd'hui pour un service personnalisé et sans stress.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" className="flex items-center gap-2" onClick={() => navigate("/quote")}>
                    <Truck className="h-4 w-4" />
                    Demander un devis
                  </Button>
                  <Button variant="outline" className="text-white border-white flex items-center gap-2" onClick={() => navigate("/contact")}>
                    <Phone className="h-4 w-4" />
                    Nous contacter
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Recevez notre guide complet par email</h3>
            <p className="mb-4">
              Obtenez gratuitement notre guide détaillé "Comment réussir son déménagement" avec encore plus de conseils et d'astuces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Recevoir le guide
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default OrganiserDemenagement;
