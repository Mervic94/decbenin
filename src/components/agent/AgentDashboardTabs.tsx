
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoveRequest } from "@/types";
import { RequestList } from "./RequestList";

interface AgentDashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  pendingRequests: MoveRequest[];
  assignedRequests: MoveRequest[];
  declinedRequests: MoveRequest[];
  openDetails: (request: MoveRequest) => void;
}

export const AgentDashboardTabs = ({
  activeTab,
  setActiveTab,
  pendingRequests,
  assignedRequests,
  declinedRequests,
  openDetails
}: AgentDashboardTabsProps) => {
  return (
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
  );
};
