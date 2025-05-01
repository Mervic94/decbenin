
import { useEffect, useState } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TruckIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { MoveRequest, Message } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Components refactorisés
import { RequestCard } from "@/components/agent/RequestCard";
import { RequestDetails } from "@/components/agent/RequestDetails";
import { ConfirmationDialog } from "@/components/agent/ConfirmationDialog";
import { MessageDialog } from "@/components/agent/MessageDialog";
import { TransferDialog } from "@/components/agent/TransferDialog";
import { AgentDashboardStats } from "@/components/agent/AgentDashboardStats";
import { RequestList } from "@/components/agent/RequestList";

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

  const pendingRequests = getPendingRequests();
  const assignedRequests = getAssignedRequests();
  const declinedRequests = requests.filter((req) => req.status === "declined");

  // Function to fetch available agents
  const fetchAgents = async () => {
    try {
      // Dans une vraie implémentation, ceci récupérerait depuis Supabase
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
      // Dans une vraie implémentation, ceci récupérerait depuis Supabase
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
            toast.error("Veuillez sélectionner un agent");
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
        
        toast.success(`La demande a été ${actionText} avec succès`);
        
        setIsConfirmOpen(false);
        setIsTransferModalOpen(false);
        closeDetails();
        
        // Refresh data
        refreshRequests();
      } else {
        toast.error("Une erreur est survenue lors du traitement de la demande");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors du traitement de la demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedRequest || !messageContent.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    setIsSubmitting(true);
    try {
      // Dans une vraie implémentation, ceci insérerait dans Supabase
      console.log("Sending message:", {
        request_id: selectedRequest.id,
        sender_id: user?.id || "",
        recipient_id: selectedRequest.user_id,
        content: messageContent.trim(),
      });
      
      // Simulation de succès pour la démonstration
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
      
      toast.success("Message envoyé au client");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi du message");
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

          <AgentDashboardStats 
            pendingRequests={pendingRequests}
            assignedRequests={assignedRequests}
            declinedRequests={declinedRequests}
          />

          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">En attente ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="assigned">Mes demandes ({assignedRequests.length})</TabsTrigger>
              <TabsTrigger value="declined">Refusées ({declinedRequests.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <RequestList 
                requests={pendingRequests} 
                openDetails={openDetails} 
                emptyMessage="Aucune demande en attente" 
              />
            </TabsContent>
            
            <TabsContent value="assigned">
              <RequestList 
                requests={assignedRequests} 
                openDetails={openDetails} 
                emptyMessage="Aucune demande assignée" 
              />
            </TabsContent>
            
            <TabsContent value="declined">
              <RequestList 
                requests={declinedRequests}
                openDetails={openDetails}
                emptyMessage="Aucune demande refusée"
              />
            </TabsContent>
          </Tabs>
        </div>

        <RequestDetails
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          selectedRequest={selectedRequest}
          messages={messages}
          user={user}
          prepareRequestAction={prepareRequestAction}
          getStatusBadge={getStatusBadge}
          getAssignmentBadge={getAssignmentBadge}
        />

        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          selectedRequest={selectedRequest}
          pendingAction={pendingAction}
          isSubmitting={isSubmitting}
          executeRequestAction={executeRequestAction}
        />

        <MessageDialog
          isOpen={isMessageModalOpen}
          onOpenChange={setIsMessageModalOpen}
          selectedRequest={selectedRequest}
          isSubmitting={isSubmitting}
          sendMessage={sendMessage}
          messageContent={messageContent}
          setMessageContent={setMessageContent}
        />

        <TransferDialog
          isOpen={isTransferModalOpen}
          onOpenChange={setIsTransferModalOpen}
          selectedRequest={selectedRequest}
          isSubmitting={isSubmitting}
          executeRequestAction={executeRequestAction}
          transferAgentId={transferAgentId}
          setTransferAgentId={setTransferAgentId}
          agentList={agentList}
          userId={user?.id}
        />
      </PageContainer>
    </Layout>
  );
};

export default AgentDashboard;
