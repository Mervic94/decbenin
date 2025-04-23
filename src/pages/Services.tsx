
import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Truck, Package, UserCheck, Building, ShieldCheck, Clock, CheckCircle, ClipboardList, Phone, Info
} from "lucide-react";
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

function SimulateurVolume() {
  // --- Ajout de l'interactivité ---
  const [cartons, setCartons] = useState('');
  const [pieces, setPieces] = useState('');
  const [resultat, setResultat] = useState<null | {
    volume: number;
    coutCFA: number;
    coutEUR: number;
    coutUSD: number;
  }>(null);

  // Méthode de calcul similaire au PHP fourni
  const calculer = () => {
    const Ncartons = parseInt(cartons) || 0;
    const Npieces = parseInt(pieces) || 0;
    const volume_par_carton = 0.05;
    const volume_par_piece = 10;
    const volume_total = (Ncartons * volume_par_carton) + (Npieces * volume_par_piece);

    const tarif_CFA = 15000;
    const tarif_EUR = 22;
    const tarif_USD = 24;

    const cout_CFA = volume_total * tarif_CFA;
    const cout_EUR = volume_total * tarif_EUR;
    const cout_USD = volume_total * tarif_USD;

    setResultat({
      volume: volume_total,
      coutCFA: cout_CFA,
      coutEUR: cout_EUR,
      coutUSD: cout_USD
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-demenagement-red shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-demenagement-red">
        <ClipboardList className="h-5 w-5" /> Estimation rapide du volume
      </h2>
      <p className="mb-4 text-muted-foreground text-sm">
        Listez rapidement le nombre de cartons/pièces pour avoir une idée du volume à déménager.
      </p>
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex flex-col">
          <label className="font-medium mb-1">Nombre de cartons</label>
          <input
            type="number"
            min="0"
            value={cartons}
            onChange={e => setCartons(e.target.value)}
            placeholder="ex: 15"
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium mb-1">Nombre de meubles</label>
          <input
            type="number"
            min="0"
            value={pieces}
            onChange={e => setPieces(e.target.value)}
            placeholder="ex: 5"
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <Button type="button" className="bg-primary mt-3 md:mt-0" onClick={calculer}>
          Estimer (simulateur illustratif)
        </Button>
      </div>
      <p className="text-xs mt-2 text-muted-foreground">Pour un devis précis, remplissez le formulaire complet.</p>
      {resultat && (
        <div className="mt-4 border rounded bg-demenagement-red/10 p-4 text-demenagement-red">
          <div className="font-semibold mb-1">Volume estimé : {resultat.volume.toFixed(2)} m³</div>
          <div className="mb-1">Estimation du coût :</div>
          <ul className="space-y-0.5 text-sm">
            <li>• {resultat.coutCFA.toLocaleString()} FCA</li>
            <li>• {resultat.coutEUR.toFixed(2)} €</li>
            <li>• {resultat.coutUSD.toFixed(2)} $</li>
          </ul>
        </div>
      )}
    </div>
  );
}

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
          <SimulateurVolume />

          {/* Main Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg border-l-8 border-demenagement-red shadow">
              <div className="w-12 h-12 bg-demenagement-red/10 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-demenagement-red" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-demenagement-red">Déménagement résidentiel</h2>
              <p className="text-muted-foreground mb-4">
                Notre équipe veille au bon déroulement de votre déménagement à chaque étape, pour les petits et grands logements.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-demenagement-red mr-2 mt-0.5" />
                  <span>Emballage & déballage professionnels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-demenagement-red mr-2 mt-0.5" />
                  <span>Démontage/remontage des meubles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-demenagement-red mr-2 mt-0.5" />
                  <span>Protection optimale de vos biens</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/quote")} className="w-full bg-demenagement-red hover:bg-demenagement-darkRed">
                Demander un devis
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-8 border-demenagement-red shadow">
              <div className="w-12 h-12 bg-demenagement-red/10 rounded-lg flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-demenagement-red" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-demenagement-red">Déménagement commercial</h2>
              <p className="text-muted-foreground mb-4">
                Limitez l'interruption de votre activité grâce à une planification efficace et une exécution rapide.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-demenagement-red mr-2 mt-0.5" />
                  <span>Planification sur mesure</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-demenagement-red mr-2 mt-0.5" />
                  <span>Manutention sécurisée équipements/bureaux</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-demenagement-red mr-2 mt-0.5" />
                  <span>Remise en service rapide</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/quote")} className="w-full bg-demenagement-red hover:bg-demenagement-darkRed">
                Demander un devis
              </Button>
            </div>
          </div>

          {/* Additional Services */}
          <h2 className="text-2xl font-bold mb-8 text-center text-demenagement-red">Services complémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-5 rounded-lg border border-demenagement-red shadow-sm text-center">
              <div className="w-12 h-12 bg-demenagement-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-demenagement-red" />
              </div>
              <h3 className="text-lg font-bold mb-2">Emballage professionnel</h3>
              <p className="text-muted-foreground">
                Matériel adapté et protection optimale pour chaque objet.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-demenagement-red shadow-sm text-center">
              <div className="w-12 h-12 bg-demenagement-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-demenagement-red" />
              </div>
              <h3 className="text-lg font-bold mb-2">Stockage sécurisé</h3>
              <p className="text-muted-foreground">
                Besoin d'espace ? Solutions de garde-meubles flexibles et sécurisées.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-demenagement-red shadow-sm text-center">
              <div className="w-12 h-12 bg-demenagement-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-6 w-6 text-demenagement-red" />
              </div>
              <h3 className="text-lg font-bold mb-2">Service personnalisé</h3>
              <p className="text-muted-foreground">
                Un conseiller dédié vous accompagne, quel que soit votre projet.
              </p>
            </div>
          </div>

          {/* Conseils pratiques */}
          <div className="bg-demenagement-red/10 rounded-lg p-8 mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center text-demenagement-red gap-2">
              <Info className="h-5 w-5" /> Conseils pratiques pour un déménagement réussi
            </h2>
            <ul className="list-disc pl-6 text-demenagement-darkRed space-y-2">
              {conseils.map((c, idx) => <li key={idx}>{c}</li>)}
            </ul>
          </div>

          {/* Checklist express */}
          <div className="bg-white rounded-lg p-6 mb-10 border border-demenagement-red">
            <h2 className="text-xl font-bold mb-3 flex items-center text-demenagement-red gap-2">
              <ClipboardList className="h-5 w-5" /> Checklist express à ne pas oublier
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-demenagement-darkRed mb-3">
              {checklistExpress.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
            <Button variant="outline" onClick={() => navigate("/checklist-demenagement")}>
              Voir la checklist complète
            </Button>
          </div>

          {/* FAQ */}
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
