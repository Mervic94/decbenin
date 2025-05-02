
import { Layout, PageContainer } from "@/components/Layout";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { StatusBadge, AssignmentBadge } from "@/components/agent/AgentBadges";
import { RequestList } from "@/components/agent/RequestList";
import { RequestDetails } from "@/components/agent/RequestDetails";
import { ConfirmationDialog } from "@/components/agent/ConfirmationDialog";
import { MessageDialog } from "@/components/agent/MessageDialog";
import { TransferDialog } from "@/components/agent/TransferDialog";
import { AgentDashboardStats } from "@/components/agent/AgentDashboardStats";
import { AgentDashboardHeader } from "@/components/agent/AgentDashboardHeader";
import { AgentDashboardTabs } from "@/components/agent/AgentDashboardTabs";

const AgentDashboard = () => {
  const {
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
  } = useAgentDashboard();

  if (!user || (user.role !== "agent" && user.role !== "admin")) return null;

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <AgentDashboardHeader 
            fullName={profile?.full_name} 
            onRefresh={refreshRequests} 
          />

          <AgentDashboardStats 
            pendingRequests={pendingRequests}
            assignedRequests={assignedRequests}
            declinedRequests={declinedRequests}
          />

          <AgentDashboardTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingRequests={pendingRequests}
            assignedRequests={assignedRequests}
            declinedRequests={declinedRequests}
            openDetails={openDetails}
          />
        </div>

        <RequestDetails
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          selectedRequest={selectedRequest}
          messages={messages}
          user={user}
          prepareRequestAction={prepareRequestAction}
          getStatusBadge={(status) => <StatusBadge status={status} />}
          getAssignmentBadge={(request) => <AssignmentBadge request={request} userId={user?.id} />}
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
