
import { Layout, PageContainer } from "@/components/Layout";

const CookiesPolicy = () => {
  return (
    <Layout>
      <PageContainer>
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Politique de Cookies</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Qu'est-ce qu'un cookie?</h2>
            <p className="mb-4">
              Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile 
              lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner 
              les sites web de manière plus efficace, ainsi que pour fournir des informations aux propriétaires 
              du site.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Comment utilisons-nous les cookies?</h2>
            <p className="mb-4">
              Notre site web utilise des cookies pour plusieurs raisons, notamment pour:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Assurer le bon fonctionnement du site (cookies essentiels)</li>
              <li>Comprendre comment vous utilisez notre site (cookies analytiques)</li>
              <li>Améliorer votre expérience utilisateur (cookies de préférences)</li>
              <li>Vous montrer des publicités pertinentes (cookies de marketing)</li>
            </ul>
            <p>
              Les cookies nous aident à vous offrir une meilleure expérience pour nos services de transport 
              au Bénin et à l'international, en permettant notamment:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>La mémorisation de vos préférences de langue</li>
              <li>La sauvegarde des informations de connexion à votre compte</li>
              <li>Le stockage temporaire des informations de votre demande de devis</li>
              <li>Le suivi de l'état de vos demandes de déménagement</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Types de cookies que nous utilisons</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Cookies strictement nécessaires</h3>
              <p>
                Ces cookies sont essentiels pour vous permettre de naviguer sur le site et utiliser ses 
                fonctionnalités. Sans ces cookies, les services que vous avez demandés, comme la connexion 
                à votre compte ou le suivi de vos demandes, ne peuvent pas être fournis.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Cookies analytiques</h3>
              <p>
                Ces cookies nous permettent de compter les visites et les sources de trafic afin de mesurer 
                et d'améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont 
                les plus et les moins populaires, et à voir comment les visiteurs se déplacent sur le site.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Cookies de préférences</h3>
              <p>
                Ces cookies permettent à notre site de se souvenir des choix que vous avez faits et de fournir 
                des fonctionnalités améliorées et plus personnelles, comme la mémorisation de votre langue préférée 
                ou de la région où vous vous trouvez.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Cookies de marketing</h3>
              <p>
                Ces cookies sont utilisés pour suivre les visiteurs sur les sites web. L'intention est d'afficher 
                des publicités qui sont pertinentes et attrayantes pour l'utilisateur individuel, et donc plus 
                précieuses pour les éditeurs et annonceurs tiers.
              </p>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Comment gérer vos cookies</h2>
            <p className="mb-4">
              Vous pouvez gérer vos préférences de cookies à tout moment en modifiant les paramètres de votre 
              navigateur. Vous pouvez également supprimer les cookies qui ont déjà été enregistrés sur votre 
              ordinateur.
            </p>
            <p>
              Veuillez noter que si vous choisissez de refuser les cookies, certaines parties de notre site 
              pourraient ne pas fonctionner correctement ou votre expérience utilisateur pourrait être limitée.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Modifications de notre politique de cookies</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de cookies à tout moment. Toute modification 
              sera publiée sur cette page. Nous vous encourageons à consulter régulièrement cette page pour rester 
              informé des mises à jour.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Contactez-nous</h2>
            <p>
              Si vous avez des questions concernant notre utilisation des cookies, n'hésitez pas à nous contacter 
              via notre page de contact.
            </p>
          </section>
          
          <div className="text-sm text-muted-foreground mt-8">
            Dernière mise à jour: 02 Mai 2024
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default CookiesPolicy;
