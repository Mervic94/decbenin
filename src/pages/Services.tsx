
import { Layout, PageContainer } from "@/components/Layout";
import { ServicesSection } from "@/components/services/ServicesSection";
import { FAQ } from "@/components/services/FAQ";
import { VolumeSimulator } from "@/components/services/VolumeSimulator";
import { CallToAction } from "@/components/services/CallToAction";
import { TestimonialCarousel } from "@/components/testimonials/TestimonialCarousel";

// Define the FAQ items
const faqItems = [
  {
    question: "Comment estimer le volume de mes biens à déménager ?",
    answer: "Vous pouvez utiliser notre simulateur de volume en ligne qui vous permet d'estimer rapidement le volume total de vos biens. Il vous suffit de sélectionner les différents meubles et objets que vous possédez."
  },
  {
    question: "Quels sont les délais pour organiser un déménagement ?",
    answer: "Nous recommandons de nous contacter au moins 2 à 3 semaines à l'avance pour un déménagement local, et 4 à 6 semaines pour un déménagement international ou de grande envergure. Néanmoins, nous pouvons également répondre à des demandes urgentes selon nos disponibilités."
  },
  {
    question: "Proposez-vous des services d'emballage ?",
    answer: "Oui, nous proposons plusieurs formules incluant l'emballage partiel ou complet de vos biens. Nos équipes peuvent se charger de l'emballage de tous vos objets, y compris les plus fragiles, avec du matériel professionnel adapté."
  },
  {
    question: "Comment se déroule un déménagement international ?",
    answer: "Un déménagement international comprend plusieurs étapes : l'évaluation de vos besoins, l'établissement d'un devis détaillé, la planification logistique, l'emballage spécifique pour le transport longue distance, les formalités douanières si nécessaire, le transport (maritime, aérien ou routier selon la destination), et enfin la livraison et le déballage à votre nouvelle adresse."
  }
];

const Services = () => {
  return (
    <Layout>
      <PageContainer>
        <div className="py-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Nos Services</h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Nous proposons une gamme complète de services de déménagement pour répondre à tous vos besoins
          </p>
          
          <ServicesSection />
          
          <VolumeSimulator />
          
          <FAQ faqs={faqItems} />

          <TestimonialCarousel />
          
          <CallToAction />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Services;
