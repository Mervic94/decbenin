
import { ReactNode } from "react";
import { MoveRequest } from "@/types";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: MoveRequest[];
  onRequestClick: (request: MoveRequest) => void;
  emptyMessage?: string;
  customAction?: (request: MoveRequest) => ReactNode;
}

export const RequestList = ({
  requests,
  onRequestClick,
  emptyMessage = "Aucune demande",
  customAction
}: RequestListProps) => {
  if (requests.length === 0) {
    return (
      <div className="flex justify-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          onClick={() => onRequestClick(request)}
          className="cursor-pointer"
        >
          <RequestCard
            request={request}
            customAction={customAction ? customAction(request) : undefined}
          />
        </div>
      ))}
    </div>
  );
};
