
import { Layout, PageContainer } from "@/components/Layout";
import { ButtonLoading } from "@/components/ui/button-loading";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Link } from "react-router-dom";
import { TruckIcon, CalendarIcon, ShieldIcon } from "lucide-react";
import { TestimonialCarousel } from "@/components/testimonials/TestimonialCarousel";

const Home = () => {
  return (
    <Layout>
      <AnimatedPage animation="fadeIn">
        <div className="relative bg-primary text-white py-24 overflow-hidden">
          {/* Arrière-plan animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
          </div>
          
          <PageContainer className="relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 whitespace-nowrap animate-fade-in">
                Déménagement Express Cotonou
              </h1>
              <p className="text-xl mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
                Votre partenaire de confiance pour un déménagement sans stress partout au Bénin et à l'international
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.6s'}}>
                <ButtonLoading 
                  size="lg" 
                  asChild 
                  className="bg-orange-500 text-white hover:bg-gray-200 hover:text-gray-800 transition-all transform hover:scale-105"
                >
                  <Link to="/request">Demander un devis</Link>
                </ButtonLoading>
                <ButtonLoading 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="text-white border-white hover:bg-white/10 transition-all transform hover:scale-105"
                >
                  <Link to="/services">Nos services</Link>
                </ButtonLoading>
              </div>
            </div>
          </PageContainer>
        </div>

        <PageContainer>
          <div className="py-16">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Pourquoi nous choisir ?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Notre expertise et notre engagement envers l'excellence font de nous le partenaire idéal pour votre déménagement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedCard animation="hover" delay={100} className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <TruckIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Service personnalisé</h3>
                <p className="text-gray-600">
                  Chaque déménagement est unique, c'est pourquoi nous adaptons nos services à vos besoins spécifiques.
                </p>
              </AnimatedCard>

              <AnimatedCard animation="hover" delay={200} className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <CalendarIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Équipe expérimentée</h3>
                <p className="text-gray-600">
                  Notre équipe de professionnels qualifiés assure un déménagement rapide et sans stress.
                </p>
              </AnimatedCard>

              <AnimatedCard animation="hover" delay={300} className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <ShieldIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Prix transparents</h3>
                <p className="text-gray-600">
                  Des devis clairs et détaillés, sans frais cachés pour une parfaite tranquillité d'esprit.
                </p>
              </AnimatedCard>
            </div>

            <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.8s'}}>
              <ButtonLoading 
                size="lg" 
                asChild 
                className="transition-all transform hover:scale-105"
              >
                <Link to="/services">Découvrir nos services</Link>
              </ButtonLoading>
            </div>
          </div>
        </PageContainer>

        {/* Testimonials Section - Visible to everyone */}
        <div className="animate-fade-in" style={{animationDelay: '1s'}}>
          <TestimonialCarousel />
        </div>

        <PageContainer>
          <div className="py-16 bg-gray-50 -mx-4 px-4 animate-fade-in" style={{animationDelay: '1.2s'}}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Prêt à déménager ?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Contactez-nous dès aujourd'hui pour un devis gratuit et sans engagement
              </p>
              <ButtonLoading 
                size="lg" 
                asChild 
                className="bg-orange-500 text-white hover:bg-gray-200 hover:text-gray-800 transition-all transform hover:scale-105"
              >
                <Link to="/request">Demander un devis gratuit</Link>
              </ButtonLoading>
            </div>
          </div>
        </PageContainer>
      </AnimatedPage>
    </Layout>
  );
};

export default Home;
