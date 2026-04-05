
import { Layout, PageContainer } from "@/components/Layout";
import { ServicesSection } from "@/components/services/ServicesSection";
import { FAQ } from "@/components/services/FAQ";
import { VolumeSimulator } from "@/components/services/VolumeSimulator";
import { CallToAction } from "@/components/services/CallToAction";
import { TestimonialCarousel } from "@/components/testimonials/TestimonialCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Truck, Package, Globe, Shield, Clock, Users, 
  CheckCircle, Star, ArrowRight, MapPin, Phone,
  Boxes, Home, Building2, Warehouse
} from "lucide-react";

const faqItems = [
  {
    question: "Comment estimer le volume de mes biens à déménager ?",
    answer: "Vous pouvez utiliser notre simulateur de volume en ligne qui vous permet d'estimer rapidement le volume total de vos biens. Il vous suffit de sélectionner les différents meubles et objets que vous possédez."
  },
  {
    question: "Quels sont les délais pour organiser un déménagement ?",
    answer: "Nous recommandons de nous contacter au moins 2 à 3 semaines à l'avance pour un déménagement local, et 4 à 6 semaines pour un déménagement international ou de grande envergure."
  },
  {
    question: "Proposez-vous des services d'emballage ?",
    answer: "Oui, nous proposons plusieurs formules incluant l'emballage partiel ou complet de vos biens. Nos équipes utilisent du matériel professionnel adapté pour protéger vos objets."
  },
  {
    question: "Comment se déroule un déménagement international ?",
    answer: "Un déménagement international comprend l'évaluation, le devis détaillé, la planification logistique, l'emballage spécialisé, les formalités douanières, le transport et la livraison à destination."
  },
  {
    question: "Les biens sont-ils assurés pendant le transport ?",
    answer: "Oui, tous vos biens sont couverts par notre assurance transport. Nous proposons également des options d'assurance complémentaire pour les objets de grande valeur."
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons les paiements par virement bancaire, Mobile Money (MTN, Moov), espèces et paiement en plusieurs fois selon les conditions convenues."
  }
];

const serviceDetails = [
  {
    icon: Home,
    title: "Déménagement Résidentiel",
    description: "Service complet pour les particuliers : appartements, maisons, villas.",
    features: ["Emballage et déballage", "Montage/démontage meubles", "Transport sécurisé", "Assurance incluse"],
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    icon: Building2,
    title: "Déménagement Commercial",
    description: "Solutions adaptées pour bureaux, commerces et entreprises.",
    features: ["Planification hors heures", "Gestion IT/mobilier", "Étiquetage par service", "Reprise rapide d'activité"],
    color: "bg-emerald-50 text-emerald-600 border-emerald-200"
  },
  {
    icon: Globe,
    title: "Déménagement International",
    description: "Transfert de vos biens à l'international avec suivi complet.",
    features: ["Formalités douanières", "Transport maritime/aérien", "Suivi en temps réel", "Partenaires mondiaux"],
    color: "bg-purple-50 text-purple-600 border-purple-200"
  },
  {
    icon: Boxes,
    title: "Emballage Professionnel",
    description: "Protection optimale de vos biens avec des matériaux de qualité.",
    features: ["Cartons renforcés", "Protection anti-choc", "Emballage objets fragiles", "Matériaux écologiques"],
    color: "bg-amber-50 text-amber-600 border-amber-200"
  },
  {
    icon: Warehouse,
    title: "Stockage Sécurisé",
    description: "Solutions de stockage temporaire ou longue durée.",
    features: ["Accès contrôlé 24/7", "Vidéosurveillance", "Conditions climatiques", "Flexibilité durée"],
    color: "bg-rose-50 text-rose-600 border-rose-200"
  },
  {
    icon: Truck,
    title: "Transport Spécialisé",
    description: "Transport d'objets lourds, encombrants ou de valeur.",
    features: ["Piano & instruments", "Œuvres d'art", "Matériel médical", "Véhicules adaptés"],
    color: "bg-cyan-50 text-cyan-600 border-cyan-200"
  }
];

const processSteps = [
  { step: 1, title: "Demande de devis", description: "Remplissez notre formulaire en ligne ou appelez-nous", icon: Phone },
  { step: 2, title: "Évaluation", description: "Un expert évalue vos besoins et le volume", icon: Users },
  { step: 3, title: "Planification", description: "Nous organisons la logistique et fixons la date", icon: Clock },
  { step: 4, title: "Déménagement", description: "Notre équipe assure le transport en toute sécurité", icon: Truck },
  { step: 5, title: "Installation", description: "Déballage et mise en place dans votre nouveau lieu", icon: CheckCircle },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Services</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Solutions complètes de déménagement au Bénin et à l'international. 
            Professionnalisme, sécurité et efficacité garantis.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" variant="secondary" onClick={() => navigate("/quote-request")}>
              Demander un devis gratuit <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate("/contact")}>
              <Phone className="mr-2 h-5 w-5" /> Nous contacter
            </Button>
          </div>
        </div>
      </div>

      <PageContainer>
        {/* Service Detail Cards */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-2">Tous nos services</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Découvrez notre gamme complète de prestations adaptées à chaque type de déménagement
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceDetails.map((service, index) => (
              <Card key={index} className={`border ${service.color.split(' ')[2]} hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${service.color.split(' ')[0]}`}>
                    <service.icon className={`h-7 w-7 ${service.color.split(' ')[1]}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 bg-muted/30 -mx-4 px-4 rounded-2xl">
          <h2 className="text-3xl font-bold text-center mb-2">Comment ça marche ?</h2>
          <p className="text-center text-muted-foreground mb-10">
            Un processus simple et transparent en 5 étapes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-3">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guarantees */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10">Nos garanties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Assurance complète", desc: "Vos biens sont protégés tout au long du transport" },
              { icon: Clock, title: "Ponctualité", desc: "Respect strict des horaires et dates convenues" },
              { icon: Star, title: "Qualité garantie", desc: "Équipes formées et matériel professionnel" },
              { icon: MapPin, title: "Couverture nationale", desc: "Intervention sur tout le territoire béninois" },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <item.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Volume Simulator */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-center mb-2">Estimez votre volume</h2>
          <p className="text-center text-muted-foreground mb-8">
            Utilisez notre simulateur pour obtenir une estimation rapide du coût de votre déménagement
          </p>
          <VolumeSimulator />
        </section>

        {/* FAQ */}
        <section className="py-8">
          <FAQ faqs={faqItems} />
        </section>

        {/* Testimonials */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-center mb-8">Ce que disent nos clients</h2>
          <TestimonialCarousel />
        </section>

        {/* CTA */}
        <CallToAction />
      </PageContainer>
    </Layout>
  );
};

export default Services;
