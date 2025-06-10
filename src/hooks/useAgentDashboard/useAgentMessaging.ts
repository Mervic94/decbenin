
import { toast } from "sonner";
import { MoveRequest } from "@/types";

export const useAgentMessaging = (
  user: any,
  setMessages: (messages: any) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setMessageContent: (content: string) => void,
  setIsMessageModalOpen: (isOpen: boolean) => void
) => {
  
  const fetchMessages = async (requestId: string) => {
    try {
      const mockMessages = [
        {
          id: "msg1",
          request_id: requestId,
          sender_id: user?.id,
          content: "Bonjour, je suis l'agent assigné à votre demande de déménagement.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "msg2",
          request_id: requestId,
          sender_id: "client-id",
          content: "Merci pour votre aide. J'ai quelques questions concernant le processus.",
          created_at: new Date(Date.now() - 1800000).toISOString(),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (selectedRequest: MoveRequest | null, messageContent: string) => {
    if (!selectedRequest || !messageContent.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage = {
        id: `msg-${Date.now()}`,
        request_id: selectedRequest.id,
        sender_id: user.id,
        content: messageContent,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageContent("");
      setIsMessageModalOpen(false);
      
      toast.success("Message envoyé avec succès");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fetchMessages,
    sendMessage
  };
};
