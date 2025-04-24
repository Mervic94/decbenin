import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Truck, Calendar, Package, User, Check, FileText, Home } from "lucide-react";
import { TestimonialCarousel } from "@/components/testimonials/TestimonialCarousel";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-20 px-4 text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Déménagement Express Cotonou
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Votre partenaire de confiance pour un déménagement sans stress partout au Bénin
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-demenagement-lightOrange text-white"
              onClick={() => navigate("/quote")}
            >
              Demander un devis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate("/services")}
            >
              Nos services
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <PageContainer>
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Planifiez</h3>
              <p className="text-gray-600">
                Remplissez notre formulaire de devis en ligne et choisissez une date qui vous convient.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Confirmez</h3>
              <p className="text-gray-600">
                Un de nos agents vous contactera pour confirmer les détails et finaliser votre réservation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Déménagez</h3>
              <p className="text-gray-600">
                Notre équipe professionnelle s'occupe de tout le jour du déménagement.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* Resources */}
      <section className="py-16 bg-white">
        <PageContainer>
          <h2 className="text-3xl font-bold text-center mb-12">Ressources pour votre déménagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Checklist de déménagement</h3>
              <p className="text-gray-600 text-center mb-6">
                Ne rien oublier lors de votre déménagement grâce à notre checklist complète.
              </p>
              <Button onClick={() => navigate("/checklist-demenagement")}>
                Voir la checklist
              </Button>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Organiser son déménagement</h3>
              <p className="text-gray-600 text-center mb-6">
                Conseils et astuces pour organiser et planifier votre déménagement efficacement.
              </p>
              <Button onClick={() => navigate("/organiser-demenagement")}>
                Découvrir les conseils
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <PageContainer>
          <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="mt-1 mr-4 bg-primary p-2 rounded-full">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Déménagement résidentiel</h3>
                <p className="text-gray-600">
                  Que vous déménagiez d'un studio ou d'une grande maison, nous adaptons nos services à vos besoins spécifiques.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-4 bg-primary p-2 rounded-full">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Emballage professionnel</h3>
                <p className="text-gray-600">
                  Notre équipe utilise des matériaux de qualité pour emballer et protéger vos biens pendant le transport.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-4 bg-primary p-2 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Déménagement commercial</h3>
                <p className="text-gray-600">
                  Minimisez les perturbations de votre entreprise avec nos services de déménagement de bureau efficaces.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-4 bg-primary p-2 rounded-full">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Stockage sécurisé</h3>
                <p className="text-gray-600">
                  Besoin de stocker vos affaires? Nous offrons des solutions de stockage sécurisées à court et long terme.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Button onClick={() => navigate("/services")}>
              Voir tous nos services
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Prêt à déménager?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Obtenez un devis gratuit et planifiez votre déménagement avec Déménagement Express Cotonou dès aujourd'hui.
          </p>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-demenagement-lightOrange text-white"
            onClick={() => navigate("/quote")}
          >
            Demander un devis
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
