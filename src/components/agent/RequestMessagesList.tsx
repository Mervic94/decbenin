
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon } from "lucide-react";
import { MoveRequest } from "@/types";

interface RequestMessagesListProps {
  messages: Message[];
  user: any;
  selectedRequest: MoveRequest;
  canMessage: boolean;
  prepareRequestAction: (request: MoveRequest, action: "approve" | "decline" | "assign" | "transfer") => void;
}

export const RequestMessagesList = ({ 
  messages, 
  user, 
  selectedRequest, 
  canMessage,
  prepareRequestAction 
}: RequestMessagesListProps) => {
  return (
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
  );
};
