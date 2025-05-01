
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  MessageSquareIcon,
  TransferIcon,
  UserPlusIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoveRequest, Message } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AgentDashboard = () => {
  const { user, isAuthenticated, profile } = useAuth();
  const { 
    requests, 
    getPendingRequests, 
    getAssignedRequests,
    updateRequestStatus, 
    assignRequestToAgent,
    transferRequestToAgent,
    refreshRequests
  } = useRequests();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<MoveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "decline" | "assign" | "transfer" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAgentId, setTransferAgentId] = useState("");
  const [agentList, setAgentList] = useState<{ id: string, full_name: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("pending");

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "agent" && user?.role !== "admin") {
      navigate("/dashboard");
    } else {
      // Fetch agents list for transfer feature
      fetchAgents();
      // Refresh requests data
      refreshRequests();
    }
  }, [isAuthenticated, user, navigate, refreshRequests]);

  // Function to fetch available agents
  const fetchAgents = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      // Simulating agent data for demo purposes
      setAgentList([
        { id: "agent1", full_name: "Agent 1" },
        { id: "agent2", full_name: "Agent 2" },
        { id: "agent3", full_name: "Agent 3" },
      ]);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  // Function to fetch messages for a request
  const fetchMessages = async (requestId: string) => {
    try {
      // In a real implementation, this would fetch from Supabase
      // Simulating message data for demo purposes
      setMessages([
        {
          id: "1",
          request_id: requestId,
          sender_id: "agent1",
          recipient_id: selectedRequest?.user_id || "",
          content: "Bonjour, je suis l'agent en charge de votre demande. Comment puis-je vous aider ?",
          read: true,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "2",
          request_id: requestId,
          sender_id: selectedRequest?.user_id || "",
          recipient_id: "agent1",
          content: "Bonjour, je voudrais savoir quand ma demande sera traitée.",
          read: true,
          created_at: new Date(Date.now() - 1800000).toISOString(),
        }
      ]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const pendingRequests = getPendingRequests();
  const assignedRequests = getAssignedRequests();
  const declinedRequests = requests.filter((req) => req.status === "declined");

  const openDetails = (request: MoveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
    if (request.id) {
      fetchMessages(request.id);
    }
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const prepareRequestAction = (
    request: MoveRequest, 
    action: "approve" | "decline" | "assign" | "transfer"
  ) => {
    setSelectedRequest(request);
    setPendingAction(action);
    
    if (action === "transfer") {
      setIsTransferModalOpen(true);
    } else if (action === "assign") {
      executeRequestAction(); // Auto-assign to current agent
    } else {
      setIsConfirmOpen(true);
    }
  };

  const executeRequestAction = async () => {
    if (!selectedRequest || !pendingAction) return;

    setIsSubmitting(true);
    try {
      let success = false;
      
      switch (pendingAction) {
        case "approve":
          success = await updateRequestStatus(selectedRequest.id, "approved");
          break;
        case "decline":
          success = await updateRequestStatus(selectedRequest.id, "declined");
          break;
        case "assign":
          success = await assignRequestToAgent(selectedRequest.id);
          break;
        case "transfer":
          if (!transferAgentId) {
            toast({
              title: "Erreur",
              description: "Veuillez sélectionner un agent",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
          success = await transferRequestToAgent(selectedRequest.id, transferAgentId);
          break;
      }

      if (success) {
        const actionText = {
          approve: "approuvée",
          decline: "refusée",
          assign: "assignée",
          transfer: "transférée"
        }[pendingAction];
        
        toast({
          title: "Succès",
          description: `La demande a été ${actionText} avec succès`,
        });
        
        setIsConfirmOpen(false);
        setIsTransferModalOpen(false);
        closeDetails();
        
        // Refresh data
        refreshRequests();
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

  const sendMessage = async () => {
    if (!selectedRequest || !messageContent.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real implementation, this would insert into Supabase
      console.log("Sending message:", {
        request_id: selectedRequest.id,
        sender_id: user?.id || "",
        recipient_id: selectedRequest.user_id,
        content: messageContent.trim(),
      });
      
      // Simulating success for demo purposes
      const newMessage = {
        id: `new-${Date.now()}`,
        request_id: selectedRequest.id,
        sender_id: user?.id || "",
        recipient_id: selectedRequest.user_id,
        content: messageContent.trim(),
        read: false,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageContent("");
      setIsMessageModalOpen(false);
      
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé au client",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message",
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

  const getAssignmentBadge = (request: MoveRequest) => {
    if (request.agent_id) {
      const isCurrentAgent = request.agent_id === user?.id;
      return (
        <Badge variant={isCurrentAgent ? "outline" : "secondary"} className={isCurrentAgent ? "border-primary text-primary" : ""}>
          {isCurrentAgent ? "Vous êtes assigné" : "Assigné à un agent"}
        </Badge>
      );
    }
    return null;
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
          <div className="flex flex-col gap-2">
            {getStatusBadge(request.status)}
            {getAssignmentBadge(request)}
          </div>
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

    const isAssigned = !!selectedRequest.agent_id;
    const isAssignedToCurrentAgent = selectedRequest.agent_id === user?.id;
    const canApprove = selectedRequest.status === "pending" && (isAssignedToCurrentAgent || !isAssigned);
    const canMessage = isAssignedToCurrentAgent;

    return (
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              Demande #{selectedRequest.id} - {getStatusBadge(selectedRequest.status)}
              {getAssignmentBadge(selectedRequest)}
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

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Messages avec le client</h3>
                {canMessage && (
                  <Button 
                    size="sm" 
                    onClick={() => setIsMessageModalOpen(true)}
                  >
                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                    Nouveau message
                  </Button>
                )}
              </div>
              
              {messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex gap-3 ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender_id !== user?.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.sender_id === selectedRequest.user_id ? "CL" : "AG"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`rounded-lg p-3 max-w-[80%] ${
                          message.sender_id === user?.id 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {format(new Date(message.created_at), "HH:mm", { locale: fr })}
                        </p>
                      </div>
                      {message.sender_id === user?.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>AG</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Aucun message pour cette demande
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-wrap gap-2">
            {!isAssigned && (
              <Button
                variant="secondary"
                onClick={() => prepareRequestAction(selectedRequest, "assign")}
              >
                <UserPlusIcon className="mr-2 h-4 w-4" />
                S'assigner cette demande
              </Button>
            )}
            
            {isAssignedToCurrentAgent && (
              <Button
                variant="outline"
                onClick={() => prepareRequestAction(selectedRequest, "transfer")}
              >
                <TransferIcon className="mr-2 h-4 w-4" />
                Transférer
              </Button>
            )}
            
            {canApprove && (
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
    if (!selectedRequest || !pendingAction || pendingAction === "transfer") return null;

    const isApprove = pendingAction === "approve";
    const isAssign = pendingAction === "assign";
    
    let title, description;
    
    if (isApprove) {
      title = "Approuver la demande";
      description = "Êtes-vous sûr de vouloir approuver cette demande de déménagement?";
    } else if (isAssign) {
      title = "S'assigner la demande";
      description = "Êtes-vous sûr de vouloir vous assigner cette demande de déménagement?";
    } else {
      title = "Refuser la demande";
      description = "Êtes-vous sûr de vouloir refuser cette demande de déménagement?";
    }
    
    return (
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
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
                : isAssign
                ? "Oui, s'assigner"
                : "Oui, refuser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const MessageDialog = () => {
    if (!selectedRequest) return null;
    
    return (
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un message au client</DialogTitle>
            <DialogDescription>
              Ce message sera envoyé au client concernant sa demande de déménagement.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea 
            placeholder="Écrivez votre message ici..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="min-h-[120px]"
          />
          
          <DialogFooter className="gap-2 flex-row justify-end">
            <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>
              Annuler
            </Button>
            <Button
              disabled={isSubmitting || !messageContent.trim()}
              onClick={sendMessage}
            >
              {isSubmitting ? "Envoi..." : "Envoyer le message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const TransferDialog = () => {
    if (!selectedRequest) return null;
    
    return (
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transférer la demande</DialogTitle>
            <DialogDescription>
              Choisissez l'agent à qui vous souhaitez transférer cette demande.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Agents disponibles</h4>
              <div className="space-y-2">
                {agentList
                  .filter(agent => agent.id !== user?.id)
                  .map(agent => (
                    <div 
                      key={agent.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer border ${
                        transferAgentId === agent.id ? 'border-primary' : 'border-border'
                      }`}
                      onClick={() => setTransferAgentId(agent.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {agent.full_name.split(' ').map(name => name[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{agent.full_name}</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-input flex items-center justify-center">
                        {transferAgentId === agent.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 flex-row justify-end">
            <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>
              Annuler
            </Button>
            <Button
              disabled={isSubmitting || !transferAgentId}
              onClick={executeRequestAction}
            >
              {isSubmitting ? "Transfert..." : "Transférer"}
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
            <Button
              variant="outline"
              onClick={() => refreshRequests()}
            >
              Rafraîchir
            </Button>
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
                <CardTitle className="text-lg">Mes demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{assignedRequests.length}</div>
                <p className="text-muted-foreground text-sm">Demandes assignées</p>
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

          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">En attente ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="assigned">Mes demandes ({assignedRequests.length})</TabsTrigger>
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
            
            <TabsContent value="assigned">
              {assignedRequests.length === 0 ? (
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune demande assignée</h3>
                    <p className="text-muted-foreground text-center">
                      Vous n'avez pas encore de demande assignée
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {assignedRequests.map((request) => (
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
        <MessageDialog />
        <TransferDialog />
      </PageContainer>
    </Layout>
  );
};

export default AgentDashboard;
