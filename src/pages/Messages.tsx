
import { useState, useEffect } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Message, Notification, MoveRequest } from "@/types";

interface MessageGroup {
  requestId: string;
  requestReference: string;
  lastMessage: Message;
  unreadCount: number;
}

const Messages = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requests, setRequests] = useState<Record<string, MoveRequest>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // For demo purposes, using mock data
      
      // Mock requests
      const mockRequests: Record<string, MoveRequest> = {
        "request1": {
          id: "request1",
          user_id: user?.id || "",
          status: "approved",
          moveDate: "2025-06-10",
          pickupAddress: {
            street: "123 Rue du Commerce",
            city: "Cotonou",
            zipCode: "01 BP 1234",
            country: "Bénin",
          },
          deliveryAddress: {
            street: "456 Avenue des Arts",
            city: "Cotonou",
            zipCode: "01 BP 5678",
            country: "Bénin",
          },
          description: "Déménagement d'un appartement 2 pièces",
          items: ["Canapé", "Lit", "Table"],
          agent_id: "agent1",
        }
      };
      
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: "msg1",
          request_id: "request1",
          sender_id: "agent1",
          recipient_id: user?.id || "",
          content: "Bonjour, je suis l'agent en charge de votre demande de déménagement. Comment puis-je vous aider ?",
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: "msg2",
          request_id: "request1",
          sender_id: user?.id || "",
          recipient_id: "agent1",
          content: "Bonjour, je voudrais savoir quand pourra avoir lieu mon déménagement.",
          read: true,
          created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        },
        {
          id: "msg3",
          request_id: "request1",
          sender_id: "agent1",
          recipient_id: user?.id || "",
          content: "Nous pouvons organiser votre déménagement pour le 10 juin comme demandé. Avez-vous des exigences particulières concernant l'horaire ?",
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
      ];
      
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: "notif1",
          user_id: user?.id || "",
          title: "Nouveau message",
          content: "Un agent vous a envoyé un message concernant votre demande de déménagement.",
          read: false,
          type: "message",
          reference_id: "request1",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "notif2",
          user_id: user?.id || "",
          title: "Demande approuvée",
          content: "Votre demande de devis a été approuvée.",
          read: true,
          type: "status_update",
          reference_id: "request1",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      
      setRequests(mockRequests);
      setNotifications(mockNotifications);
      
      // Group messages by request
      const groupedMessages: Record<string, Message[]> = {};
      mockMessages.forEach(msg => {
        if (!groupedMessages[msg.request_id]) {
          groupedMessages[msg.request_id] = [];
        }
        groupedMessages[msg.request_id].push(msg);
      });
      
      // Create message groups with last message and unread count
      const groups: MessageGroup[] = Object.entries(groupedMessages).map(([requestId, msgs]) => {
        // Sort messages by date (newest last)
        msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
        const unreadCount = msgs.filter(m => !m.read && m.recipient_id === user?.id).length;
        
        return {
          requestId,
          requestReference: `REF-${requestId.toUpperCase()}`,
          lastMessage: msgs[msgs.length - 1],
          unreadCount,
        };
      });
      
      setMessageGroups(groups);
      
      // If there's at least one group, select it
      if (groups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(groups[0].requestId);
        setMessages(groupedMessages[groups[0].requestId]);
      } else if (selectedGroupId && groupedMessages[selectedGroupId]) {
        setMessages(groupedMessages[selectedGroupId]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    // In a real implementation, this would update the message in Supabase
    setMessages(prev => 
      prev.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      )
    );
  };

  const handleSelectGroup = (requestId: string) => {
    setSelectedGroupId(requestId);
    
    // Find messages for this request
    const requestMessages = messages.filter(m => m.request_id === requestId);
    setMessages(requestMessages);
    
    // Mark unread messages as read
    requestMessages.forEach(msg => {
      if (!msg.read && msg.recipient_id === user?.id) {
        markAsRead(msg.id);
      }
    });
    
    // Update unread count in groups
    setMessageGroups(prev => 
      prev.map(group => 
        group.requestId === requestId
          ? { ...group, unreadCount: 0 }
          : group
      )
    );
  };

  const sendMessage = async () => {
    if (!selectedGroupId || !newMessage.trim() || !user) {
      return;
    }
    
    try {
      const recipientId = messages.find(m => m.sender_id !== user.id)?.sender_id || "agent1";
      
      const newMsg: Message = {
        id: `new-${Date.now()}`,
        request_id: selectedGroupId,
        sender_id: user.id,
        recipient_id: recipientId,
        content: newMessage.trim(),
        read: false,
        created_at: new Date().toISOString(),
      };
      
      // In a real implementation, this would insert into Supabase
      setMessages(prev => [...prev, newMsg]);
      
      // Update last message in groups
      setMessageGroups(prev => 
        prev.map(group => 
          group.requestId === selectedGroupId
            ? { ...group, lastMessage: newMsg }
            : group
        )
      );
      
      setNewMessage("");
      
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message",
        variant: "destructive",
      });
    }
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "'Aujourd'hui à' HH:mm", { locale: fr });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return format(messageDate, "'Hier à' HH:mm", { locale: fr });
    } else {
      return format(messageDate, "dd/MM/yyyy 'à' HH:mm", { locale: fr });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-5xl mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Messagerie</h1>
          
          <div className="bg-background border rounded-lg overflow-hidden h-[600px] flex">
            {/* Conversation List */}
            <div className="w-1/3 border-r overflow-auto">
              <div className="p-4 border-b sticky top-0 bg-background">
                <h2 className="font-medium">Conversations</h2>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : messageGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Aucune conversation</p>
                </div>
              ) : (
                <div>
                  {messageGroups.map(group => (
                    <div
                      key={group.requestId}
                      className={`p-3 border-b cursor-pointer hover:bg-accent transition-colors ${
                        selectedGroupId === group.requestId ? "bg-accent" : ""
                      }`}
                      onClick={() => handleSelectGroup(group.requestId)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{group.requestReference}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {group.lastMessage.sender_id === user?.id ? "Vous: " : ""}{group.lastMessage.content}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">
                            {formatMessageDate(group.lastMessage.created_at).split(' à ')[0]}
                          </span>
                          {group.unreadCount > 0 && (
                            <Badge className="mt-1 bg-primary hover:bg-primary">{group.unreadCount}</Badge>
                          )}
                        </div>
                      </div>
                      
                      {requests[group.requestId] && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {format(new Date(requests[group.requestId].moveDate), "dd/MM/yyyy")}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Chat Area */}
            <div className="w-2/3 flex flex-col">
              {selectedGroupId && (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background">
                    <div>
                      <h2 className="font-medium">
                        {messageGroups.find(g => g.requestId === selectedGroupId)?.requestReference}
                      </h2>
                      {requests[selectedGroupId] && (
                        <p className="text-sm text-muted-foreground">
                          Déménagement du {format(new Date(requests[selectedGroupId].moveDate), "d MMMM yyyy", { locale: fr })}
                        </p>
                      )}
                    </div>
                    {requests[selectedGroupId]?.status && (
                      <Badge>
                        {requests[selectedGroupId].status === "approved" ? "Approuvé" : 
                          requests[selectedGroupId].status === "pending" ? "En attente" : 
                          requests[selectedGroupId].status === "declined" ? "Refusé" : 
                          "Terminé"}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex gap-3 ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender_id !== user?.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AG</AvatarFallback>
                          </Avatar>
                        )}
                        <div 
                          className={`rounded-lg p-3 max-w-[80%] ${
                            message.sender_id === user?.id 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatMessageDate(message.created_at)}
                          </p>
                        </div>
                        {message.sender_id === user?.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Écrivez votre message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {!selectedGroupId && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-xl mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-muted-foreground">
                    Sélectionnez une conversation pour afficher les messages
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Messages;
