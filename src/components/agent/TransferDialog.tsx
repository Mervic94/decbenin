
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface AgentItem {
  id: string;
  full_name: string;
}

interface TransferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: MoveRequest | null;
  isSubmitting: boolean;
  executeRequestAction: () => void;
  transferAgentId: string;
  setTransferAgentId: (id: string) => void;
  agentList: AgentItem[];
}

export const TransferDialog = ({
  isOpen,
  onOpenChange,
  selectedRequest,
  isSubmitting,
  executeRequestAction,
  transferAgentId,
  setTransferAgentId,
  agentList,
  userId,
}: TransferDialogProps & { userId?: string }) => {
  if (!selectedRequest) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transférer la demande</DialogTitle>
          <DialogDescription>
            Choisissez l'agent à qui vous souhaitez transférer cette demande.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Agents disponibles</h4>
            <div className="space-y-2">
              {agentList
                .filter(agent => agent.id !== userId)
                .map(agent => (
                  <div 
                    key={agent.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer border ${
                      transferAgentId === agent.id ? 'border-primary' : 'border-border'
                    }`}
                    onClick={() => setTransferAgentId(agent.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {agent.full_name.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{agent.full_name}</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-input flex items-center justify-center">
                      {transferAgentId === agent.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 flex-row justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            disabled={isSubmitting || !transferAgentId}
            onClick={executeRequestAction}
          >
            {isSubmitting ? "Transfert..." : "Transférer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
