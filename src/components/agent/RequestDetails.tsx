
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoveRequest, Message } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RequestAddressDetails } from "./RequestAddressDetails";
import { RequestMessagesList } from "./RequestMessagesList";
import { RequestActionsFooter } from "./RequestActionsFooter";

interface RequestDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: MoveRequest | null;
  messages: Message[];
  user: any;
  prepareRequestAction: (request: MoveRequest, action: "approve" | "decline" | "assign" | "transfer") => void;
  getStatusBadge: (status: string) => JSX.Element;
  getAssignmentBadge: (request: MoveRequest) => JSX.Element | null;
}

export const RequestDetails = ({
  isOpen,
  onOpenChange,
  selectedRequest,
  messages,
  user,
  prepareRequestAction,
  getStatusBadge,
  getAssignmentBadge,
}: RequestDetailsProps) => {
  if (!selectedRequest) return null;

  const isAssigned = !!selectedRequest.agent_id;
  const isAssignedToCurrentAgent = selectedRequest.agent_id === user?.id;
  const canApprove = selectedRequest.status === "pending" && (isAssignedToCurrentAgent || !isAssigned);
  const canMessage = isAssignedToCurrentAgent;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande</DialogTitle>
          <DialogDescription>
            Demande #{selectedRequest.id} - {getStatusBadge(selectedRequest.status)}
            {getAssignmentBadge(selectedRequest)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Date de création</h3>
              <p>
                {format(new Date(selectedRequest.created_at || ""), "d MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Date prévue</h3>
              <p className="font-medium">
                {format(new Date(selectedRequest.moveDate), "EEEE d MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>

          <Separator />
          
          <RequestAddressDetails selectedRequest={selectedRequest} />

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{selectedRequest.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Articles à déménager</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRequest.items.map((item, index) => (
                <Badge key={index} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <RequestMessagesList 
            messages={messages} 
            user={user} 
            selectedRequest={selectedRequest} 
            canMessage={canMessage}
            prepareRequestAction={prepareRequestAction}
          />
        </div>

        <RequestActionsFooter 
          selectedRequest={selectedRequest}
          user={user}
          prepareRequestAction={prepareRequestAction}
          isAssigned={isAssigned}
          isAssignedToCurrentAgent={isAssignedToCurrentAgent}
          canApprove={canApprove}
        />
      </DialogContent>
    </Dialog>
  );
};
