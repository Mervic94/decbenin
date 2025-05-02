
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
  };

  const handleRefuse = () => {
    localStorage.setItem('cookie-consent', 'refused');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-lg">Utilisation des cookies</h3>
          <p className="text-sm mt-1">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            En continuant à naviguer, vous acceptez notre utilisation des cookies 
            conformément à notre politique de confidentialité.
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
