
import { Button } from "@/components/ui/button";
import { MoveRequest } from "@/types";
import { RequestCard } from "./RequestCard";
import { EmptyRequestState } from "./EmptyRequestState";

interface RequestsListProps {
  requests: MoveRequest[];
}

export const RequestsList = ({ requests }: RequestsListProps) => {
  if (requests.length === 0) {
    return <EmptyRequestState />;
  }

  return (
    <div>
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
};
