
import { useState, useEffect } from 'react';

type CookieConsent = 'accepted' | 'refused' | null;
type CookieType = 'essential' | 'analytics' | 'preferences' | 'marketing';

export const useCookieManager = () => {
  const [cookieConsent, setCookieConsent] = useState<CookieConsent>(null);

  // Charger le consentement stocké lors du montage du composant
  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent') as CookieConsent;
    setCookieConsent(storedConsent);
  }, []);

  // Vérifier si un type spécifique de cookie est autorisé
  const isCookieAllowed = (cookieType: CookieType): boolean => {
    // Les cookies essentiels sont toujours autorisés
    if (cookieType === 'essential') return true;
    
    // Pour les autres types, nous vérifions le consentement
    return cookieConsent === 'accepted';
  };

  // Enregistrer un cookie
  const setCookie = (
    name: string, 
    value: string, 
    cookieType: CookieType, 
    expiryDays: number = 365
  ): boolean => {
    // Vérifier si ce type de cookie est autorisé
    if (!isCookieAllowed(cookieType)) return false;
    
    // Calculer la date d'expiration
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    
    // Définir le cookie
    document.cookie = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    return true;
  };

  // Récupérer un cookie par son nom
  const getCookie = (name: string): string | null => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
    
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  };

  // Supprimer un cookie
  const removeCookie = (name: string): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Mettre à jour le consentement des cookies
  const updateCookieConsent = (consent: CookieConsent): void => {
    localStorage.setItem('cookie-consent', consent || '');
    setCookieConsent(consent);
    
    // Si le consentement est refusé, supprimons les cookies non essentiels
    if (consent === 'refused') {
      clearNonEssentialCookies();
    }
  };
  
  // Supprimer tous les cookies non essentiels
  const clearNonEssentialCookies = (): void => {
    // Liste des cookies essentiels que nous voulons conserver
    const essentialCookies = ['session_id', 'csrf_token'];
    
    // Récupérer tous les cookies et supprimer ceux qui ne sont pas essentiels
    document.cookie.split(';').forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      if (!essentialCookies.includes(cookieName)) {
        removeCookie(cookieName);
      }
    });
  };

  return {
    cookieConsent,
    isCookieAllowed,
    setCookie,
    getCookie,
    removeCookie,
    updateCookieConsent,
    clearNonEssentialCookies
  };
};
