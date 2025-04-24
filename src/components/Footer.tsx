
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  MessageSquare,
  Linkedin 
} from "lucide-react";
import Map from "./Map";

export const Footer = () => {
  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/demenagementexpresscotonou/", 
      label: "Facebook" 
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/demenagementexpresscotonou", 
      label: "Instagram" 
    },
    { 
      icon: MessageCircle, 
      href: "https://wa.me/+22901663555", 
      label: "WhatsApp" 
    },
    { 
      icon: MessageSquare, 
      href: "https://m.me/demenagementexpresscotonou", 
      label: "Messenger" 
    },
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/company/demenagement-express-cotonou", 
      label: "LinkedIn" 
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground pt-10 pb-5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Déménagement Express Cotonou</h3>
            <p className="mb-4">
              Votre partenaire de confiance pour tous vos besoins de déménagement au Bénin.
              Service professionnel, rapide et sécurisé.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-secondary transition">
                  Déménagement résidentiel
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-secondary transition">
                  Déménagement commercial
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-secondary transition">
                  Déménagement international
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-secondary transition">
                  Emballage et déballage
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>123 Rue Principale, Cotonou, Bénin</li>
              <li>Téléphone: +229 01 663 555 09</li>
              <li>Email: demenagementexpresscotonou@gmail.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Notre localisation</h3>
            <Map height="200px" />
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-foreground hover:text-secondary transition-colors"
                aria-label={social.label}
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
          <p>
            &copy; {new Date().getFullYear()} Déménagement Express Cotonou. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
