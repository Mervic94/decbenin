import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VolumeSimulator } from "@/components/services/VolumeSimulator";
import { ServicesSection } from "@/components/services/ServicesSection";
import { Info, ClipboardList, Truck, Package, UserCheck, Building, ShieldCheck, Phone } from "lucide-react";
import { useState } from "react";

const faq = [
  {
    question: "Comment obtenir un devis pour mon déménagement ?",
    answer:
      "Il vous suffit de cliquer sur « Demander un devis » et de remplir le formulaire en ligne. Nous vous répondrons rapidement avec une proposition personnalisée.",
  },
  {
    question: "Faites-vous des déménagements longue distance ou internationaux ?",
    answer:
      "Oui, nous proposons des solutions pour les déménagements nationaux et internationaux. Contactez-nous pour plus de détails.",
  },
  {
    question: "Proposez-vous un service d'emballage/déballage ?",
    answer:
      "Bien sûr ! Notre équipe peut tout prendre en charge : emballage, déballage et protection de vos biens.",
  },
  {
    question: "Est-ce que mes biens sont assurés pendant le déménagement ?",
    answer:
      "Oui, tous vos biens sont couverts par notre assurance pendant la totalité de la prestation.",
  },
];

const conseils = [
  "Préparez vos cartons à l’avance, en étiquetant chaque boîte par pièce.",
  "Débarrassez-vous des objets inutiles avant le jour J.",
  "Protégez les objets fragiles à l’aide de papier bulle ou de couvertures.",
  "Gardez avec vous vos objets de valeur et documents importants.",
];

const checklistExpress = [
  "Faire le tri dans vos affaires",
  "Réserver votre créneau de déménagement",
  "Commander des cartons adaptés",
  "Prévenir votre propriétaire/syndic",
  "Mettre à jour votre adresse auprès des organismes",
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

          {/* Services Section */}
          <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
          <ServicesSection />
          <div className="text-center mt-10">
            <Button onClick={() => navigate("/quote")}>
              Voir tous nos services
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg p-6 border border-demenagement-red">
            <h2 className="text-xl font-bold mb-5 flex items-center text-demenagement-red gap-2">
              <Info className="h-5 w-5" /> Foire aux questions
            </h2>
            <div className="space-y-4">
              {faq.map((q, i) => (
                <details key={i} className="rounded border border-demenagement-red/30 px-4 py-2 cursor-pointer group">
                  <summary className="font-medium text-demenagement-red focus:outline-none group-open:underline group-open:font-bold">
                    {q.question}
                  </summary>
                  <div className="mt-2 text-sm text-muted-foreground">{q.answer}</div>
                </details>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-10">
            <h2 className="text-2xl font-bold mb-2 text-demenagement-red">Prêt à déménager ?</h2>
            <p className="text-muted-foreground mb-4">
              Obtenez un devis gratuit et personnalisé pour votre déménagement dès aujourd'hui.
            </p>
            <Button size="lg" className="bg-demenagement-red hover:bg-demenagement-darkRed text-white" onClick={() => navigate("/quote")}>
              Demander un devis
            </Button>
            <div className="mt-6 flex justify-center items-center gap-4">
              <a href="tel:+2290166355509" className="flex items-center gap-2 text-demenagement-red font-medium hover:underline">
                <Phone className="h-5 w-5" /> +229 01 663 555 09
              </a>
              <span className="text-muted-foreground">|</span>
              <a href="mailto:demenagementexpresscotonou@gmail.com" className="flex items-center gap-2 text-demenagement-red font-medium hover:underline">
                <Info className="h-5 w-5" /> demenagementexpresscotonou@gmail.com
              </a>
            </div>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Services;
