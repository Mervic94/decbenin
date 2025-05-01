
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MoveRequest } from "@/types";

interface MessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: MoveRequest | null;
  isSubmitting: boolean;
  sendMessage: () => void;
  messageContent: string;
  setMessageContent: (content: string) => void;
}

export const MessageDialog = ({
  isOpen,
  onOpenChange,
  selectedRequest,
  isSubmitting,
  sendMessage,
  messageContent,
  setMessageContent,
}: MessageDialogProps) => {
  if (!selectedRequest) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer un message au client</DialogTitle>
          <DialogDescription>
            Ce message sera envoyé au client concernant sa demande de déménagement.
          </DialogDescription>
        </DialogHeader>
        
        <Textarea 
          placeholder="Écrivez votre message ici..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          className="min-h-[120px]"
        />
        
        <DialogFooter className="gap-2 flex-row justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            disabled={isSubmitting || !messageContent.trim()}
            onClick={sendMessage}
          >
            {isSubmitting ? "Envoi..." : "Envoyer le message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
