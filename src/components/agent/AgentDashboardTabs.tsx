
import { ReactNode } from "react";
import { MoveRequest } from "@/types";
import { RequestList } from "./RequestList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentDashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequests: MoveRequest[];
  assignedRequests: MoveRequest[];
  declinedRequests: MoveRequest[];
  openDetails: (request: MoveRequest) => void;
  customActions?: {
    pending?: (request: MoveRequest) => ReactNode;
    assigned?: (request: MoveRequest) => ReactNode;
    declined?: (request: MoveRequest) => ReactNode;
  };
}

export const AgentDashboardTabs = ({
  activeTab,
  setActiveTab,
  pendingRequests,
  assignedRequests,
  declinedRequests,
  openDetails,
  customActions
}: AgentDashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="pending">
          En attente ({pendingRequests.length})
        </TabsTrigger>
        <TabsTrigger value="assigned">
          Assignées ({assignedRequests.length})
        </TabsTrigger>
        <TabsTrigger value="declined">
          Refusées ({declinedRequests.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <RequestList
          requests={pendingRequests}
          onRequestClick={openDetails}
          emptyMessage="Aucune demande en attente"
          customAction={customActions?.pending}
        />
      </TabsContent>

      <TabsContent value="assigned">
        <RequestList
          requests={assignedRequests}
          onRequestClick={openDetails}
          emptyMessage="Aucune demande assignée"
          customAction={customActions?.assigned}
        />
      </TabsContent>

      <TabsContent value="declined">
        <RequestList
          requests={declinedRequests}
          onRequestClick={openDetails}
          emptyMessage="Aucune demande refusée"
          customAction={customActions?.declined}
        />
      </TabsContent>
    </Tabs>
  );
};
