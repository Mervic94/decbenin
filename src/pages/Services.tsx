
import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VolumeSimulator } from "@/components/services/VolumeSimulator";
import { ServicesSection } from "@/components/services/ServicesSection";
import { FAQ } from "@/components/services/FAQ";
import { CallToAction } from "@/components/services/CallToAction";

const faq = [
  {
    question: "Comment obtenir un devis pour mon déménagement ?",
    answer: "Il vous suffit de cliquer sur « Demander un devis » et de remplir le formulaire en ligne. Nous vous répondrons rapidement avec une proposition personnalisée."
  },
  {
    question: "Faites-vous des déménagements longue distance ou internationaux ?",
    answer: "Oui, nous proposons des solutions pour les déménagements nationaux et internationaux. Contactez-nous pour plus de détails."
  },
  {
    question: "Proposez-vous un service d'emballage/déballage ?",
    answer: "Bien sûr ! Notre équipe peut tout prendre en charge : emballage, déballage et protection de vos biens."
  },
  {
    question: "Est-ce que mes biens sont assurés pendant le déménagement ?",
    answer: "Oui, tous vos biens sont couverts par notre assurance pendant la totalité de la prestation."
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-10">
          <h1 className="text-4xl font-bold mb-4 text-center text-demenagement-red">
            Nos Services
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-8">
            Découvrez notre gamme complète de services de déménagement adaptés à vos besoins.
          </p>

          <VolumeSimulator />

          <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
          <ServicesSection />
          <div className="text-center mt-10">
            <Button onClick={() => navigate("/quote")}>
              Voir tous nos services
            </Button>
          </div>

          <FAQ faqs={faq} />
          <CallToAction />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Services;
