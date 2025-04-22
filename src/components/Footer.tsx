
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground pt-10 pb-5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <li>Téléphone: +229 00 00 00 00</li>
              <li>Email: contact@demenagement-express-cotonou.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Déménagement Express Cotonou. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
