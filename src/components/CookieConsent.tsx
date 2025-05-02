
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
    
    // Activer les cookies analytiques et de préférences
    enableCookies();
  };

  const handleRefuse = () => {
    localStorage.setItem('cookie-consent', 'refused');
    setShowConsent(false);
    
    // Désactiver tous les cookies non-essentiels
    disableCookies();
  };

  // Fonction pour activer les cookies
  const enableCookies = () => {
    // Dans une implémentation réelle, cette fonction activerait les cookies tiers
    console.log("Cookies activés");
    
    // Exemple pour Google Analytics
    // window['ga-disable-UA-XXXXXXXX-X'] = false;
  };

  // Fonction pour désactiver les cookies
  const disableCookies = () => {
    // Dans une implémentation réelle, cette fonction désactiverait les cookies tiers
    console.log("Cookies désactivés");
    
    // Exemple pour Google Analytics
    // window['ga-disable-UA-XXXXXXXX-X'] = true;
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-lg">Utilisation des cookies</h3>
          <p className="text-sm mt-1">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site et pour 
            faciliter vos demandes de transport au Bénin et à l'international. Les cookies 
            nous aident à comprendre comment vous utilisez notre site et à personnaliser nos services. 
            {' '}
            <Link to="/cookies-policy" className="underline hover:text-primary transition-colors">
              En savoir plus sur notre politique de cookies
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefuse} className="border-white hover:bg-gray-800">
            Refuser
          </Button>
          <Button onClick={handleAccept} className="bg-primary hover:bg-primary/90">
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
};
