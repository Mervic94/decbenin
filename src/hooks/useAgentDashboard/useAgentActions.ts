
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/request";
import { MoveRequest } from "@/types";
import { toast } from "sonner";

export const useAgentActions = (
  setSelectedRequest: (request: MoveRequest | null) => void,
  setIsDetailsOpen: (isOpen: boolean) => void,
  setIsConfirmOpen: (isOpen: boolean) => void,
  setPendingAction: (action: "approve" | "decline" | "assign" | "transfer" | null) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setMessages: (messages: any) => void,
  setIsMessageModalOpen: (isOpen: boolean) => void,
  setIsTransferModalOpen: (isOpen: boolean) => void,
  setTransferAgentId: (agentId: string) => void,
  transferAgentId: string,
  selectedRequest: MoveRequest | null,
  pendingAction: "approve" | "decline" | "assign" | "transfer" | null,
  messageContent: string,
  setMessageContent: (content: string) => void,
  setIsQuoteRequestModalOpen: (isOpen: boolean) => void
) => {
  const { user } = useAuth();
  const { updateRequestStatus, assignRequestToAgent, transferRequestToAgent, refreshRequests, createRequest } = useRequests();

  const openDetails = (request: MoveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
    fetchMessages(request.id);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedRequest(null);
      setMessages([]);
    }, 200);
  };

  const fetchMessages = async (requestId: string) => {
    // Simulate API call to get messages for this request
    try {
      // Dans une vraie implémentation, ceci récupérerait depuis Supabase
      const mockMessages = [
        {
          id: "msg1",
          request_id: requestId,
          sender_id: user?.id,
          content: "Bonjour, je suis l'agent assigné à votre demande de déménagement.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "msg2",
          request_id: requestId,
          sender_id: "client-id", // This would be the actual client ID
          content: "Merci pour votre aide. J'ai quelques questions concernant le processus.",
          created_at: new Date(Date.now() - 1800000).toISOString(),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
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
    if (!selectedRequest || !pendingAction || !user) return;
    
    setIsSubmitting(true);
    
    try {
      let success = false;
      let actionText = "";
      
      switch (pendingAction) {
        case "approve":
          success = await updateRequestStatus(selectedRequest.id, "approved");
          actionText = "approuvée";
          break;
        case "decline":
          success = await updateRequestStatus(selectedRequest.id, "declined");
          actionText = "refusée";
          break;
        case "assign":
          success = await assignRequestToAgent(selectedRequest.id, user.id);
          actionText = "assignée";
          break;
        case "transfer":
          if (transferAgentId) {
            success = await transferRequestToAgent(selectedRequest.id, transferAgentId);
            actionText = "transférée";
          } else {
            toast.error("Veuillez sélectionner un agent pour le transfert");
            setIsSubmitting(false);
            return;
          }
          break;
      }
      
      if (success) {
        toast.success(`La demande a été ${actionText} avec succès`);
        
        setIsConfirmOpen(false);
        setIsTransferModalOpen(false);
        closeDetails();
        
        // Refresh data
        refreshRequests();
      } else {
        toast.error("Une erreur est survenue lors de la mise à jour de la demande");
      }
    } catch (error) {
      console.error("Error executing action:", error);
      toast.error("Une erreur est survenue lors de la mise à jour de la demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedRequest || !messageContent.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to send a message
      // Dans une vraie implémentation, ceci enverrait à Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage = {
        id: `msg-${Date.now()}`,
        request_id: selectedRequest.id,
        sender_id: user.id,
        content: messageContent,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageContent("");
      setIsMessageModalOpen(false);
      
      toast.success("Message envoyé avec succès");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuoteSubmit = async (formData: any) => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      // Extract form data
      const { pickupAddress, deliveryAddress, moveDate, description, items } = formData;
      
      // Convert items string to array
      const itemsList = items.split(',').map((item: string) => item.trim()).filter(Boolean);
      
      // Create the request
      const success = await createRequest(
        pickupAddress,
        deliveryAddress,
        moveDate,
        description,
        itemsList
      );
      
      if (success) {
        toast.success("Demande de devis créée avec succès");
        setIsQuoteRequestModalOpen(false);
        // Refresh data
        refreshRequests();
        return true;
      } else {
        toast.error("Une erreur est survenue lors de la création de la demande de devis");
        return false;
      }
    } catch (error) {
      console.error("Error creating quote request:", error);
      toast.error("Une erreur est survenue lors de la création de la demande de devis");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    openDetails,
    closeDetails,
    prepareRequestAction,
    executeRequestAction,
    sendMessage,
    fetchMessages,
    handleQuoteSubmit
  };
};
