
import { MoveRequest } from "@/types";
import { useAgentMessaging } from "./useAgentMessaging";
import { useAgentRequestActions } from "./useAgentRequestActions";
import { useAgentQuoteManagement } from "./useAgentQuoteManagement";

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
  setIsQuoteRequestModalOpen: (isOpen: boolean) => void,
  user: any,
  refreshRequests: () => void
) => {

  const { fetchMessages, sendMessage } = useAgentMessaging(
    user,
    setMessages,
    setIsSubmitting,
    setMessageContent,
    setIsMessageModalOpen
  );

  const { prepareRequestAction, executeRequestAction } = useAgentRequestActions(
    setSelectedRequest,
    setIsDetailsOpen,
    setIsConfirmOpen,
    setPendingAction,
    setIsSubmitting,
    setIsTransferModalOpen,
    transferAgentId,
    selectedRequest,
    pendingAction,
    refreshRequests
  );

  const { handleQuoteSubmit } = useAgentQuoteManagement(
    user,
    setIsSubmitting,
    setIsQuoteRequestModalOpen,
    refreshRequests
  );

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

  const sendMessageHandler = () => {
    sendMessage(selectedRequest, messageContent);
  };

  return {
    openDetails,
    closeDetails,
    prepareRequestAction,
    executeRequestAction,
    sendMessage: sendMessageHandler,
    fetchMessages,
    handleQuoteSubmit
  };
};
