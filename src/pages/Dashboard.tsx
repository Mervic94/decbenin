
import { useEffect } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TruckIcon, Plus, CalendarIcon, HomeIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MoveRequest } from "@/types";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserRequests } = useRequests();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const userRequests = getUserRequests();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case "declined":
        return <Badge variant="destructive">Refusé</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Terminé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const RequestCard = ({ request }: { request: MoveRequest }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Déménagement du {format(new Date(request.moveDate), "d MMMM yyyy", { locale: fr })}
            </CardTitle>
            <CardDescription>
              Demande créée le {format(new Date(request.createdAt), "d MMMM yyyy", { locale: fr })}
            </CardDescription>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <HomeIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Adresse de départ</p>
              <p className="text-sm text-muted-foreground">
                {request.pickupAddress.street}, {request.pickupAddress.city},{" "}
                {request.pickupAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Adresse de destination</p>
              <p className="text-sm text-muted-foreground">
                {request.deliveryAddress.street}, {request.deliveryAddress.city},{" "}
                {request.deliveryAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date du déménagement</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(request.moveDate), "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">{request.description}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Articles à déménager</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {request.items.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full">
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );

  if (!user) return null;

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground">
                Bienvenue, {user.name}
              </p>
            </div>
            <Button onClick={() => navigate("/quote")}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userRequests.length}</div>
                <p className="text-muted-foreground text-sm">Total de demandes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {userRequests.filter((req) => req.status === "pending").length}
                </div>
                <p className="text-muted-foreground text-sm">Demandes en attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Approuvées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {userRequests.filter((req) => req.status === "approved").length}
                </div>
                <p className="text-muted-foreground text-sm">Demandes approuvées</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Vos demandes de déménagement</h2>
            
            {userRequests.length === 0 ? (
              <Card className="bg-muted">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune demande</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Vous n'avez pas encore soumis de demande de déménagement
                  </p>
                  <Button onClick={() => navigate("/quote")}>
                    <Plus className="mr-2 h-4 w-4" /> Créer une demande
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                {userRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Dashboard;
