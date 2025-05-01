
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoveRequest } from "@/types";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: MoveRequest | null;
  pendingAction: "approve" | "decline" | "assign" | "transfer" | null;
  isSubmitting: boolean;
  executeRequestAction: () => void;
}

export const ConfirmationDialog = ({
  isOpen,
  onOpenChange,
  selectedRequest,
  pendingAction,
  isSubmitting,
  executeRequestAction,
}: ConfirmationDialogProps) => {
  if (!selectedRequest || !pendingAction || pendingAction === "transfer") return null;

  const isApprove = pendingAction === "approve";
  const isAssign = pendingAction === "assign";
  
  let title, description;
  
  if (isApprove) {
    title = "Approuver la demande";
    description = "Êtes-vous sûr de vouloir approuver cette demande de déménagement?";
  } else if (isAssign) {
    title = "S'assigner la demande";
    description = "Êtes-vous sûr de vouloir vous assigner cette demande de déménagement?";
  } else {
    title = "Refuser la demande";
    description = "Êtes-vous sûr de vouloir refuser cette demande de déménagement?";
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 flex-row justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            disabled={isSubmitting}
            variant={isApprove ? "default" : "destructive"}
            onClick={executeRequestAction}
          >
            {isSubmitting
              ? "Traitement..."
              : isApprove
              ? "Oui, approuver"
              : isAssign
              ? "Oui, s'assigner"
              : "Oui, refuser"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
