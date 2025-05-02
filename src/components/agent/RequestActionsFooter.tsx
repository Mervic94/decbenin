
import { MoveRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckIcon, UserPlusIcon, XIcon } from "lucide-react";
import { TransferIcon } from "@/utils/icons";

interface RequestActionsFooterProps {
  selectedRequest: MoveRequest;
  user: any;
  prepareRequestAction: (request: MoveRequest, action: "approve" | "decline" | "assign" | "transfer") => void;
  isAssigned: boolean;
  isAssignedToCurrentAgent: boolean;
  canApprove: boolean;
}

export const RequestActionsFooter = ({
  selectedRequest,
  user,
  prepareRequestAction,
  isAssigned,
  isAssignedToCurrentAgent,
  canApprove
}: RequestActionsFooterProps) => {
  return (
    <div className="flex-wrap gap-2 flex justify-end">
      {!isAssigned && (
        <Button
          variant="secondary"
          onClick={() => prepareRequestAction(selectedRequest, "assign")}
        >
          <UserPlusIcon className="mr-2 h-4 w-4" />
          S'assigner cette demande
        </Button>
      )}
      
      {isAssignedToCurrentAgent && (
        <Button
          variant="outline"
          onClick={() => prepareRequestAction(selectedRequest, "transfer")}
        >
          <TransferIcon className="mr-2 h-4 w-4" />
          Transférer
        </Button>
      )}
      
      {canApprove && (
        <>
          <Button
            variant="outline"
            onClick={() => prepareRequestAction(selectedRequest, "decline")}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Refuser
          </Button>
          <Button onClick={() => prepareRequestAction(selectedRequest, "approve")}>
            <CheckIcon className="mr-2 h-4 w-4" />
            Approuver
          </Button>
        </>
      )}
    </div>
  );
};
