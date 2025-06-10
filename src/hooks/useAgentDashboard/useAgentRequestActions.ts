
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/request";
import { MoveRequest } from "@/types";
import { toast } from "sonner";

export const useAgentRequestActions = (
  setSelectedRequest: (request: MoveRequest | null) => void,
  setIsDetailsOpen: (isOpen: boolean) => void,
  setIsConfirmOpen: (isOpen: boolean) => void,
  setPendingAction: (action: "approve" | "decline" | "assign" | "transfer" | null) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setIsTransferModalOpen: (isOpen: boolean) => void,
  transferAgentId: string,
  selectedRequest: MoveRequest | null,
  pendingAction: "approve" | "decline" | "assign" | "transfer" | null,
  refreshRequests: () => void
) => {
  const { user } = useAuth();
  const { updateRequestStatus, assignRequestToAgent, transferRequestToAgent } = useRequests();

  const prepareRequestAction = (
    request: MoveRequest, 
    action: "approve" | "decline" | "assign" | "transfer"
  ) => {
    setSelectedRequest(request);
    setPendingAction(action);
    
    if (action === "transfer") {
      setIsTransferModalOpen(true);
    } else if (action === "assign") {
      executeRequestAction();
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
        setIsDetailsOpen(false);
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

  return {
    prepareRequestAction,
    executeRequestAction
  };
};
