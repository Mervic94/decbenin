
import { Layout, PageContainer } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OrganiserDemenagement = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <PageContainer>
        <div className="py-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Organiser Son Déménagement</h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Guide pratique et conseils pour un déménagement réussi au Bénin
          </p>
          
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-2">Planification et préparation</h2>
                <Separator className="mb-4" />
                <p className="mb-4">
                  La clé d'un déménagement réussi est une bonne planification. Commencez par établir un calendrier 
                  détaillé des tâches à accomplir dans les semaines précédant votre départ. Prévoyez une marge 
                  de sécurité pour faire face aux imprévus.
                </p>
                <p>
                  N'oubliez pas de prendre en compte les particularités du contexte béninois : saison des pluies, 
                  état des routes, disponibilité des services, etc. Si possible, évitez de déménager pendant 
                  la saison des pluies (mai à juillet).
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-2">Tri et inventaire</h2>
                <Separator className="mb-4" />
                <p className="mb-4">
                  Avant d'emballer, triez vos affaires et débarrassez-vous de ce dont vous n'avez plus besoin. 
                  Faites un inventaire précis de tous les objets que vous souhaitez déménager, en notant leur 
                  état. Cela vous sera utile en cas de dommages pendant le transport.
                </p>
                <p>
                  Pour les objets dont vous ne voulez plus, envisagez de les donner à des associations locales 
                  ou de les vendre sur les marchés d'occasion.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-2">Emballage efficace</h2>
                <Separator className="mb-4" />
                <p className="mb-4">
                  Procurez-vous des cartons solides, du papier bulle et du ruban adhésif de qualité. Commencez 
                  par emballer les objets non essentiels et que vous n'utiliserez pas avant le déménagement.
                </p>
                <p className="mb-4">
                  Étiquetez clairement chaque carton avec son contenu et la pièce où il devra être déposé dans 
                  votre nouveau logement. Pour les objets fragiles, utilisez du papier journal ou du papier bulle 
                  et indiquez "FRAGILE" sur le carton.
                </p>
                <p>
                  Au Bénin, pensez à protéger particulièrement vos affaires contre l'humidité et la poussière, 
                  surtout si vous déménagez pendant la saison des pluies.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-2">Transport et logistique</h2>
                <Separator className="mb-4" />
                <p className="mb-4">
                  Choisir une entreprise de déménagement professionnelle vous évitera bien des soucis. Demandez 
                  plusieurs devis, vérifiez les avis et assurez-vous que l'entreprise dispose d'une assurance couvrant 
                  d'éventuels dommages.
                </p>
                <p>
                  Si vous optez pour un déménagement par vos propres moyens, louez un véhicule adapté au 
                  volume de vos affaires et prévoyez de l'aide pour le chargement et le déchargement. N'oubliez 
                  pas de sécuriser vos biens pendant le transport.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-2">Installation dans votre nouveau logement</h2>
                <Separator className="mb-4" />
                <p className="mb-4">
                  Avant d'emménager, nettoyez votre nouveau logement et vérifiez les installations (électricité, 
                  plomberie, etc.). Déballez d'abord les cartons contenant les objets essentiels : articles de 
                  toilette, quelques vêtements, ustensiles de cuisine de base.
                </p>
                <p>
                  Prenez votre temps pour installer vos meubles et décorer votre nouveau chez-vous. L'important 
                  est de vous y sentir bien le plus rapidement possible.
                </p>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-12">
              <Button size="lg" onClick={() => navigate("/quote")}>
                Demander un devis de déménagement
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default OrganiserDemenagement;
