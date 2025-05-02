
import { Button } from "@/components/ui/button";
import { MoveRequest } from "@/types";
import { RequestCard } from "./RequestCard";
import { EmptyRequestState } from "./EmptyRequestState";

interface RequestsListProps {
  requests: MoveRequest[];
  showAgentName?: boolean;
}

export const RequestsList = ({ requests, showAgentName = false }: RequestsListProps) => {
  if (requests.length === 0) {
    return <EmptyRequestState />;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard 
          key={request.id} 
          request={request} 
          showAgentName={showAgentName}
        />
      ))}
    </div>
  );
};
