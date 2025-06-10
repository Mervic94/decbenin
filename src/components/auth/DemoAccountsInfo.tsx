
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Shield, UserCheck } from "lucide-react";

export const DemoAccountsInfo = () => {
  const demoAccounts = [
    {
      role: "Client",
      email: "client@moveit.com",
      password: "demopass123",
      description: "Peut créer des demandes de devis et suivre ses déménagements",
      icon: User,
      badgeColor: "bg-blue-500"
    },
    {
      role: "Agent",
      email: "agent@moveit.com", 
      password: "demopass123",
      description: "Peut gérer les demandes, assigner et traiter les devis",
      icon: UserCheck,
      badgeColor: "bg-green-500"
    },
    {
      role: "Modérateur",
      email: "moderator@moveit.com",
      password: "demopass123", 
      description: "Supervise les agents et modère le contenu",
      icon: Shield,
      badgeColor: "bg-orange-500"
    },
    {
      role: "Admin",
      email: "admin@moveit.com",
      password: "demopass123",
      description: "Accès complet à toutes les fonctionnalités",
      icon: Users,
      badgeColor: "bg-red-500"
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Comptes de démonstration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Utilisez ces comptes pour tester les différentes fonctionnalités de l'application
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {demoAccounts.map((account) => {
            const IconComponent = account.icon;
            return (
              <div key={account.email} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{account.role}</span>
                  <Badge className={`${account.badgeColor} text-white`}>
                    Demo
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div><strong>Email:</strong> {account.email}</div>
                  <div><strong>Mot de passe:</strong> {account.password}</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {account.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
