
import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  TruckIcon,
  CalendarIcon,
  HomeIcon,
  MapPinIcon,
  CheckIcon,
  XIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MoveRequest } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgentDashboard = () => {
  const { user, isAuthenticated, profile } = useAuth();
  const { requests, getPendingRequests, updateRequestStatus } = useRequests();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<MoveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "decline" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "agent" && user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const pendingRequests = getPendingRequests();
  const approvedRequests = requests.filter((req) => req.status === "approved");
  const declinedRequests = requests.filter((req) => req.status === "declined");

  const openDetails = (request: MoveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const prepareRequestAction = (request: MoveRequest, action: "approve" | "decline") => {
    setSelectedRequest(request);
    setPendingAction(action);
    setIsConfirmOpen(true);
  };

  const executeRequestAction = async () => {
    if (!selectedRequest || !pendingAction) return;

    setIsSubmitting(true);
    try {
      const status = pendingAction === "approve" ? "approved" : "declined";
      const success = await updateRequestStatus(
        selectedRequest.id,
        status
      );

      if (success) {
        toast({
          title: pendingAction === "approve" ? "Demande approuvée" : "Demande refusée",
          description: `La demande a été ${
            pendingAction === "approve" ? "approuvée" : "refusée"
          } avec succès`,
        });
        setIsConfirmOpen(false);
        closeDetails();
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du traitement de la demande",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la demande",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <Card className="mb-4" onClick={() => openDetails(request)} style={{ cursor: "pointer" }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Déménagement du {format(new Date(request.moveDate), "d MMMM yyyy", { locale: fr })}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <UserIcon className="h-3 w-3" />
              Client #{request.user_id}
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
              <p className="text-sm font-medium">Départ</p>
              <p className="text-sm text-muted-foreground">
                {request.pickupAddress.city}, {request.pickupAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Destination</p>
              <p className="text-sm text-muted-foreground">
                {request.deliveryAddress.city}, {request.deliveryAddress.zipCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(request.moveDate), "EEEE d MMMM", { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            openDetails(request);
          }}
        >
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );

  const RequestDetails = () => {
    if (!selectedRequest) return null;

    return (
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              Demande #{selectedRequest.id} - {getStatusBadge(selectedRequest.status)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Date de création</h3>
                <p>
                  {format(new Date(selectedRequest.created_at || ""), "d MMMM yyyy à HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Date prévue</h3>
                <p className="font-medium">
                  {format(new Date(selectedRequest.moveDate), "EEEE d MMMM yyyy", {
                    locale: fr,
                  })}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Adresse de départ</h3>
              <div className="bg-muted rounded-md p-3">
                <p>{selectedRequest.pickupAddress.street}</p>
                <p>
                  {selectedRequest.pickupAddress.city}, {selectedRequest.pickupAddress.zipCode}
                </p>
                <p>{selectedRequest.pickupAddress.country}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Adresse de destination</h3>
              <div className="bg-muted rounded-md p-3">
                <p>{selectedRequest.deliveryAddress.street}</p>
                <p>
                  {selectedRequest.deliveryAddress.city}, {selectedRequest.deliveryAddress.zipCode}
                </p>
                <p>{selectedRequest.deliveryAddress.country}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{selectedRequest.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Articles à déménager</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRequest.items.map((item, index) => (
                  <Badge key={index} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            {selectedRequest.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => prepareRequestAction(selectedRequest, "decline")}
                >
                  <XIcon className="mr-2 h-4 w-4" />
                  Refuser
                </Button>
                <Button onClick={() => prepareRequestAction(selectedRequest, "approve")}>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Approuver
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const ConfirmationDialog = () => {
    if (!selectedRequest || !pendingAction) return null;

    const isApprove = pendingAction === "approve";
    
    return (
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isApprove ? "Approuver la demande" : "Refuser la demande"}
            </DialogTitle>
            <DialogDescription>
              {isApprove
                ? "Êtes-vous sûr de vouloir approuver cette demande de déménagement?"
                : "Êtes-vous sûr de vouloir refuser cette demande de déménagement?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 flex-row justify-end">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              disabled={isSubmitting}
              variant={isApprove ? "default" : "destructive"}
              onClick={executeRequestAction}
            >
              {isSubmitting
                ? "Traitement..."
                : isApprove
                ? "Oui, approuver"
                : "Oui, refuser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (!user || (user.role !== "agent" && user.role !== "admin")) return null;

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Espace Agent</h1>
              <p className="text-muted-foreground">
                Bienvenue, {profile?.full_name || "Agent"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingRequests.length}</div>
                <p className="text-muted-foreground text-sm">Demandes à traiter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Approuvées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{approvedRequests.length}</div>
                <p className="text-muted-foreground text-sm">Demandes approuvées</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Refusées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{declinedRequests.length}</div>
                <p className="text-muted-foreground text-sm">Demandes refusées</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">En attente ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="approved">Approuvées ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="declined">Refusées ({declinedRequests.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingRequests.length === 0 ? (
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune demande en attente</h3>
                    <p className="text-muted-foreground text-center">
                      Toutes les demandes ont été traitées
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {pendingRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approved">
              {approvedRequests.length === 0 ? (
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune demande approuvée</h3>
                    <p className="text-muted-foreground text-center">
                      Vous n'avez pas encore approuvé de demande
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {approvedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="declined">
              {declinedRequests.length === 0 ? (
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune demande refusée</h3>
                    <p className="text-muted-foreground text-center">
                      Vous n'avez pas encore refusé de demande
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {declinedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <RequestDetails />
        <ConfirmationDialog />
      </PageContainer>
    </Layout>
  );
};

export default AgentDashboard;
