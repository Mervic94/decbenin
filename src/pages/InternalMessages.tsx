
import { useState, useEffect } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Send, MessageSquare } from "lucide-react";

interface InternalMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  recipient_name: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
}

const InternalMessages = () => {
  const { user, profile, userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  // Redirect if not authenticated or not an admin/agent
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    } 
    
    if (userRole !== "admin" && userRole !== "agent") {
      navigate("/dashboard");
      return;
    }
    
    fetchStaffMembers();
    fetchMessages();
  }, [isAuthenticated, userRole, navigate]);

  const fetchStaffMembers = async () => {
    try {
      // Pour la démonstration, utilisons des données fictives
      const mockStaff: StaffMember[] = [
        {
          id: "admin1",
          full_name: "Admin Demo",
          role: "admin"
        },
        {
          id: "agent1", 
          full_name: "Agent Demo",
          role: "agent"
        },
        {
          id: "agent2",
          full_name: "Agent 2",
          role: "agent"
        }
      ];
      
      // Filtrer pour exclure l'utilisateur actuel
      const filteredStaff = mockStaff.filter(staff => staff.id !== user?.id);
      setStaffMembers(filteredStaff);
      
      // Sélectionner par défaut le premier destinataire si rien n'est sélectionné
      if (!selectedRecipient && filteredStaff.length > 0) {
        setSelectedRecipient(filteredStaff[0].id);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel:", error);
      toast.error("Impossible de charger la liste du personnel");
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Pour la démonstration, utilisons des données fictives
      const mockMessages: InternalMessage[] = [
        {
          id: "msg1",
          sender_id: "agent1",
          sender_name: "Agent Demo",
          recipient_id: "admin1",
          recipient_name: "Admin Demo",
          content: "Bonjour Admin, j'ai une question concernant la demande de déménagement #12345. Le client souhaite modifier la date.",
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "msg2",
          sender_id: "admin1",
          sender_name: "Admin Demo",
          recipient_id: "agent1",
          recipient_name: "Agent Demo",
          content: "Bonjour Agent, oui vous pouvez modifier la date si cela convient à notre planning. Vérifiez la disponibilité sur le calendrier.",
          read: false,
          created_at: new Date(Date.now() - 43200000).toISOString()
        }
      ];
      
      // Filtrer les messages pour l'utilisateur actuel (envoyés ou reçus)
      const userMessages = mockMessages.filter(
        msg => msg.sender_id === user?.id || msg.recipient_id === user?.id
      );
      
      // Trier par date, plus récent en premier
      userMessages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setMessages(userMessages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      toast.error("Impossible de charger les messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedRecipient) {
      toast.error("Veuillez sélectionner un destinataire et écrire un message");
      return;
    }
    
    setIsSending(true);
    try {
      // Dans une implémentation réelle, ceci serait enregistré dans Supabase
      const recipient = staffMembers.find(staff => staff.id === selectedRecipient);
      
      if (!recipient) {
        throw new Error("Destinataire non trouvé");
      }
      
      const newMessage: InternalMessage = {
        id: `new-${Date.now()}`,
        sender_id: user?.id || "",
        sender_name: profile?.full_name || user?.email || "Utilisateur",
        recipient_id: selectedRecipient,
        recipient_name: recipient.full_name,
        content: messageContent.trim(),
        read: false,
        created_at: new Date().toISOString()
      };
      
      // Ajouter le message à la liste locale
      setMessages(prev => [newMessage, ...prev]);
      setMessageContent("");
      
      toast.success("Message envoyé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
    } finally {
      setIsSending(false);
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

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Messagerie Interne</h1>
              <p className="text-muted-foreground">
                Communication entre les membres de l'équipe
              </p>
            </div>
            <Button onClick={fetchMessages}>Actualiser</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Chargement des messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun message</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id}
                        className={`border rounded-lg p-4 ${
                          message.sender_id === user?.id 
                            ? "bg-primary/10" 
                            : message.read 
                              ? "bg-background" 
                              : "bg-accent/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {message.sender_name?.split(" ").map(part => part[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {message.sender_id === user?.id ? "Vous" : message.sender_name}
                                  <span className="text-sm font-normal text-muted-foreground ml-2">
                                    à {message.recipient_id === user?.id ? "Vous" : message.recipient_name}
                                  </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatMessageDate(message.created_at)}
                                </p>
                              </div>
                              {!message.read && message.recipient_id === user?.id && (
                                <Badge>Non lu</Badge>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Nouveau Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="recipient" className="text-sm font-medium">
                    Destinataire
                  </label>
                  <Select 
                    value={selectedRecipient} 
                    onValueChange={setSelectedRecipient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.full_name} ({staff.role === "admin" ? "Admin" : "Agent"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Écrivez votre message..."
                    rows={5}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleSendMessage}
                  disabled={isSending || !messageContent.trim() || !selectedRecipient}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? "Envoi en cours..." : "Envoyer"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default InternalMessages;
