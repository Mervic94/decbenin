
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveRequest } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestContext";

export const useAgentActions = (
  setSelectedRequest: (request: MoveRequest | null) => void,
  setIsDetailsOpen: (isOpen: boolean) => void,
  setIsConfirmOpen: (isOpen: boolean) => void,
  setPendingAction: (action: "approve" | "decline" | "assign" | "transfer" | null) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setMessages: (messages: any) => void,
  setIsMessageModalOpen: (isOpen: boolean) => void,
  isTransferModalOpen: (isOpen: boolean) => void,
  setTransferAgentId: (agentId: string) => void,
  transferAgentId: string,
  selectedRequest: MoveRequest | null,
  pendingAction: "approve" | "decline" | "assign" | "transfer" | null,
  messageContent: string,
  setMessageContent: (content: string) => void
) => {
  const { user } = useAuth();
  const { 
    updateRequestStatus, 
    assignRequestToAgent,
    transferRequestToAgent,
    refreshRequests
  } = useRequests();

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
      isTransferModalOpen(true);
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
        isTransferModalOpen(false);
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

  return {
    openDetails,
    closeDetails,
    prepareRequestAction,
    executeRequestAction,
    sendMessage,
    fetchMessages
  };
};
