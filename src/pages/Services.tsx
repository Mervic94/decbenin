
import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Truck, 
  Package, 
  UserCheck, 
  Building, 
  ShieldCheck, 
  Clock, 
  CheckCircle
} from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="text-4xl font-bold mb-6 text-center">Nos Services</h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Découvrez notre gamme complète de services de déménagement adaptés à vos besoins
          </p>

          {/* Main Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-3">Déménagement résidentiel</h2>
              <p className="text-muted-foreground mb-4">
                Notre service de déménagement résidentiel s'occupe de tout, des petits appartements aux grandes maisons. Notre équipe expérimentée s'assure que vos biens sont manipulés avec soin.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Emballage et déballage professionnels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Démontage et remontage des meubles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Transport sécurisé et efficace</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/quote")} className="w-full">
                Demander un devis
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-3">Déménagement commercial</h2>
              <p className="text-muted-foreground mb-4">
                Minimisez les perturbations pour votre entreprise avec notre service de déménagement commercial. Nous travaillons rapidement pour que votre entreprise soit opérationnelle le plus vite possible.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Planification stratégique du déménagement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Manipulation sécurisée des équipements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Réinstallation rapide et efficace</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/quote")} className="w-full">
                Demander un devis
              </Button>
            </div>
          </div>

          {/* Additional Services */}
          <h2 className="text-2xl font-bold mb-8 text-center">Services complémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-5 rounded-lg border border-border shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Emballage professionnel</h3>
              <p className="text-muted-foreground">
                Notre équipe utilise des matériaux de qualité pour emballer vos biens avec soin et garantir leur sécurité pendant le transport.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-border shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Stockage sécurisé</h3>
              <p className="text-muted-foreground">
                Besoin de stocker vos affaires? Nous offrons des solutions de stockage sécurisées à court et long terme.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-border shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Service personnalisé</h3>
              <p className="text-muted-foreground">
                Nous adaptons nos services à vos besoins spécifiques pour vous offrir une expérience de déménagement sur mesure.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-muted rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Pourquoi nous choisir?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Service rapide</h3>
                <p className="text-muted-foreground">
                  Nous respectons les délais et travaillons efficacement pour votre tranquillité d'esprit.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Personnel qualifié</h3>
                <p className="text-muted-foreground">
                  Notre équipe est formée et expérimentée dans tous les aspects du déménagement.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Sécurité garantie</h3>
                <p className="text-muted-foreground">
                  Nous traitons vos biens avec le plus grand soin et assurons leur sécurité.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à déménager?</h2>
            <p className="text-muted-foreground mb-6">
              Obtenez un devis gratuit et personnalisé pour votre déménagement dès aujourd'hui.
            </p>
            <Button size="lg" onClick={() => navigate("/quote")}>
              Demander un devis
            </Button>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Services;
