
import { TruckIcon } from "lucide-react";
import { MoveRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: MoveRequest[];
  openDetails: (request: MoveRequest) => void;
  emptyMessage: string;
}

export const RequestList = ({ requests, openDetails, emptyMessage }: RequestListProps) => {
  if (requests.length === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <TruckIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
          <p className="text-muted-foreground text-center">
            Aucune demande disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} openDetails={openDetails} />
      ))}
    </div>
  );
};
