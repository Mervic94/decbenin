
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Truck,
  FileText,
  MessageSquare,
  ShieldAlert,
  Settings,
  LineChart,
  Map,
} from "lucide-react";

export const AdminModules = () => {
  const modules = [
    {
      title: "Gestion des Utilisateurs",
      description: "Gérer les utilisateurs, agents et modérateurs",
      icon: <Users className="h-12 w-12 text-blue-500" />,
      link: "/admin/users",
    },
    {
      title: "Demandes de Devis",
      description: "Traiter les demandes de devis entrantes",
      icon: <FileText className="h-12 w-12 text-green-500" />,
      link: "/agent-dashboard",
    },
    {
      title: "Espace Modérateur",
      description: "Assigner les demandes aux agents",
      icon: <ShieldAlert className="h-12 w-12 text-red-500" />,
      link: "/moderator-dashboard",
    },
    {
      title: "Espace Agent",
      description: "Répondre aux demandes assignées",
      icon: <Truck className="h-12 w-12 text-orange-500" />,
      link: "/agent-dashboard",
    },
    {
      title: "Messagerie",
      description: "Communiquer avec les clients et agents",
      icon: <MessageSquare className="h-12 w-12 text-purple-500" />,
      link: "/messages",
    },
    {
      title: "Rapports & Statistiques",
      description: "Visualiser les performances",
      icon: <LineChart className="h-12 w-12 text-indigo-500" />,
      link: "/admin/reports",
    },
    {
      title: "Suivi des Déménagements",
      description: "Suivre les déménagements en cours",
      icon: <Map className="h-12 w-12 text-teal-500" />,
      link: "/admin/tracking",
    },
    {
      title: "Paramètres Système",
      description: "Configurer les paramètres de l'application",
      icon: <Settings className="h-12 w-12 text-gray-500" />,
      link: "/admin/settings",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Modules d'Administration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">{module.icon}</div>
              <CardTitle className="text-xl text-center">{module.title}</CardTitle>
              <CardDescription className="text-center">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button asChild className="w-full">
                <Link to={module.link}>Accéder</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
