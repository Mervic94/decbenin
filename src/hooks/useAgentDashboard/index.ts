
import { useAgentDashboardState } from "./useAgentDashboardState";
import { useAgentActions } from "./useAgentActions";
import { useAgentData } from "./useAgentData";

export const useAgentDashboard = () => {
  const {
    selectedRequest,
    setSelectedRequest,
    isDetailsOpen,
    setIsDetailsOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    pendingAction,
    setPendingAction,
    isSubmitting,
    setIsSubmitting,
    isMessageModalOpen,
    setIsMessageModalOpen,
    messageContent,
    setMessageContent,
    isTransferModalOpen,
    setIsTransferModalOpen,
    transferAgentId,
    setTransferAgentId,
    agentList,
    setAgentList,
    messages,
    setMessages,
    activeTab,
    setActiveTab
  } = useAgentDashboardState();

  const {
    user,
    profile,
    pendingRequests,
    assignedRequests,
    declinedRequests,
    getStatusBadge,
    getAssignmentBadge,
    refreshRequests
  } = useAgentData();

  const {
    openDetails,
    closeDetails,
    prepareRequestAction,
    executeRequestAction,
    sendMessage,
    fetchMessages
  } = useAgentActions(
    setSelectedRequest,
    setIsDetailsOpen,
    setIsConfirmOpen,
    setPendingAction,
    setIsSubmitting,
    setMessages,
    setIsMessageModalOpen,
    setIsTransferModalOpen,
    setTransferAgentId,
    transferAgentId,
    selectedRequest,
    pendingAction,
    messageContent,
    setMessageContent
  );

  return {
    user,
    profile,
    pendingRequests,
    assignedRequests,
    declinedRequests,
    selectedRequest,
    isDetailsOpen,
    setIsDetailsOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    pendingAction,
    isSubmitting,
    isMessageModalOpen,
    setIsMessageModalOpen,
    messageContent,
    setMessageContent,
    isTransferModalOpen,
    setIsTransferModalOpen,
    transferAgentId,
    setTransferAgentId,
    agentList,
    messages,
    activeTab,
    setActiveTab,
    openDetails,
    prepareRequestAction,
    executeRequestAction,
    sendMessage,
    getStatusBadge,
    getAssignmentBadge,
    refreshRequests
  };
};
