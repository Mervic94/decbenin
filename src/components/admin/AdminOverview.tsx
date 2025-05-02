
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Truck,
  FileText,
  MessageSquare,
  ShieldAlert,
  Settings,
} from "lucide-react";

export const AdminOverview = () => {
  // In a real app, this data would come from your API
  const stats = [
    {
      title: "Utilisateurs",
      value: "246",
      description: "Utilisateurs actifs",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      color: "border-blue-500",
    },
    {
      title: "Demandes",
      value: "89",
      description: "Demandes en attente",
      icon: <FileText className="h-5 w-5 text-green-500" />,
      color: "border-green-500",
    },
    {
      title: "Déménagements",
      value: "124",
      description: "Déménagements en cours",
      icon: <Truck className="h-5 w-5 text-orange-500" />,
      color: "border-orange-500",
    },
    {
      title: "Messages",
      value: "18",
      description: "Messages non lus",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      color: "border-purple-500",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Vue d'ensemble</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`border-t-4 ${stat.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {stat.title}
                {stat.icon}
              </CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
