
import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TruckIcon } from "lucide-react";
import { TestimonialCarousel } from "@/components/testimonials/TestimonialCarousel";

const Home = () => {
  return (
    <Layout>
      <div className="relative bg-primary text-white py-24">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Déménagement Express Cotonou
            </h1>
            <p className="text-xl mb-8">
              Votre partenaire de confiance pour un déménagement sans stress partout au Bénin et à l'international
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-orange-500 text-white hover:bg-gray-200 hover:text-gray-800 transition-all transform hover:scale-105">
                <Link to="/request">Demander un devis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10 transition-all transform hover:scale-105">
                <Link to="/services">Nos services</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre expertise et notre engagement envers l'excellence font de nous le partenaire idéal pour votre déménagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service personnalisé</h3>
              <p className="text-gray-600">
                Chaque déménagement est unique, c'est pourquoi nous adaptons nos services à vos besoins spécifiques.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TruckIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Équipe expérimentée</h3>
              <p className="text-gray-600">
                Notre équipe de professionnels qualifiés assure un déménagement rapide et sans stress.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <TruckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prix transparents</h3>
              <p className="text-gray-600">
                Des devis clairs et détaillés, sans frais cachés pour une parfaite tranquillité d'esprit.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild className="transition-all transform hover:scale-105">
              <Link to="/services">Découvrir nos services</Link>
            </Button>
          </div>
        </div>
      </PageContainer>

      {/* Testimonials Section - Visible to everyone */}
      <TestimonialCarousel />

      <PageContainer>
        <div className="py-16 bg-gray-50 -mx-4 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à déménager ?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Contactez-nous dès aujourd'hui pour un devis gratuit et sans engagement
            </p>
            <Button size="lg" asChild className="bg-orange-500 text-white hover:bg-gray-200 hover:text-gray-800 transition-all transform hover:scale-105">
              <Link to="/request">Demander un devis gratuit</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Home;
