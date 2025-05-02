
import { useState } from "react";
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
import { QuoteRequestModal } from "@/components/agent/QuoteRequestModal";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModeratorDashboard = () => {
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
    isQuoteRequestModalOpen,
    setIsQuoteRequestModalOpen,
    quoteFormData,
    setQuoteFormData,
    openDetails,
    prepareRequestAction,
    executeRequestAction,
    sendMessage,
    getStatusBadge,
    getAssignmentBadge,
    refreshRequests,
    handleQuoteSubmit
  } = useAgentDashboard();

  // For the assignment dialog
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [requestType, setRequestType] = useState("residential");

  if (!user) return null;

  const assignRequest = () => {
    if (selectedRequest && selectedAgentId) {
      prepareRequestAction(selectedRequest, "assign");
      setTransferAgentId(selectedAgentId);
      executeRequestAction();
      setIsAssignDialogOpen(false);
    }
  };

  const openAssignDialog = (request: any) => {
    openDetails(request);
    setIsAssignDialogOpen(true);
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <AgentDashboardHeader 
            fullName={profile?.full_name} 
            onRefresh={refreshRequests}
            role="Modérateur"
          />

          <div className="flex items-center justify-between mt-6 mb-8">
            <AgentDashboardStats 
              pendingRequests={pendingRequests}
              assignedRequests={assignedRequests}
              declinedRequests={declinedRequests}
            />
            <Button 
              onClick={() => setIsQuoteRequestModalOpen(true)}
              className="ml-4 whitespace-nowrap"
            >
              <FileText className="mr-2 h-4 w-4" />
              Nouvelle demande de devis
            </Button>
          </div>

          <AgentDashboardTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingRequests={pendingRequests}
            assignedRequests={assignedRequests}
            declinedRequests={declinedRequests}
            openDetails={openDetails}
            customActions={{
              pending: (request) => (
                <Button 
                  size="sm" 
                  className="ml-2" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openAssignDialog(request);
                  }}
                >
                  Assigner
                </Button>
              )
            }}
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

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assigner la demande</DialogTitle>
              <DialogDescription>
                Classifiez et assignez cette demande à un agent.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="request-type">Type de demande</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger id="request-type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Résidentiel</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agent-id">Agent assigné</Label>
                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                  <SelectTrigger id="agent-id">
                    <SelectValue placeholder="Sélectionnez un agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentList.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={assignRequest} disabled={!selectedAgentId || isSubmitting}>
                {isSubmitting ? "En cours..." : "Assigner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

        <QuoteRequestModal
          isOpen={isQuoteRequestModalOpen}
          onOpenChange={setIsQuoteRequestModalOpen}
          quoteFormData={quoteFormData}
          setQuoteFormData={setQuoteFormData}
          isSubmitting={isSubmitting}
          handleQuoteSubmit={handleQuoteSubmit}
        />
      </PageContainer>
    </Layout>
  );
};

export default ModeratorDashboard;
