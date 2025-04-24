
import { Truck, Package, User } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

export function ServicesSection() {
  const services = [
    {
      icon: Truck,
      title: "Déménagement résidentiel",
      description: "Que vous déménagiez d'un studio ou d'une grande maison, nous adaptons nos services à vos besoins spécifiques."
    },
    {
      icon: Package,
      title: "Emballage professionnel",
      description: "Notre équipe utilise des matériaux de qualité pour emballer et protéger vos biens pendant le transport."
    },
    {
      icon: User,
      title: "Déménagement commercial",
      description: "Minimisez les perturbations de votre entreprise avec nos services de déménagement de bureau efficaces."
    },
    {
      icon: Package,
      title: "Stockage sécurisé",
      description: "Besoin de stocker vos affaires? Nous offrons des solutions de stockage sécurisées à court et long terme."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
}
