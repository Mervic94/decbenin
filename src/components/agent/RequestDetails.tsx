import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckIcon, MessageSquareIcon, UserPlusIcon, XIcon } from "lucide-react";
import { TransferIcon } from "@/utils/icons";
import { MoveRequest, Message } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

          <div className="space-y-2">
            <h3 className="font-medium">Adresse de départ</h3>
            <div className="bg-muted rounded-md p-3">
              <p>{selectedRequest.pickupAddress.street}</p>
              <p>
                {selectedRequest.pickupAddress.city}, {selectedRequest.pickupAddress.zipCode}
              </p>
              <p>{selectedRequest.pickupAddress.country}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Adresse de destination</h3>
            <div className="bg-muted rounded-md p-3">
              <p>{selectedRequest.deliveryAddress.street}</p>
              <p>
                {selectedRequest.deliveryAddress.city}, {selectedRequest.deliveryAddress.zipCode}
              </p>
              <p>{selectedRequest.deliveryAddress.country}</p>
            </div>
          </div>

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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Messages avec le client</h3>
              {canMessage && (
                <Button 
                  size="sm" 
                  onClick={() => prepareRequestAction(selectedRequest, "approve")}
                >
                  <MessageSquareIcon className="mr-2 h-4 w-4" />
                  Nouveau message
                </Button>
              )}
            </div>
            
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex gap-3 ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender_id !== user?.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender_id === selectedRequest.user_id ? "CL" : "AG"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.sender_id === user?.id 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {format(new Date(message.created_at), "HH:mm", { locale: fr })}
                      </p>
                    </div>
                    {message.sender_id === user?.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AG</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Aucun message pour cette demande
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
