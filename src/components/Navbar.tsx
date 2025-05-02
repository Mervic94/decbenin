import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Package, LogOut, FileText, Home, MessageSquare, Bell, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types";

export const Navbar = () => {
  const { user, profile, userRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadMessagesCount();
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchUnreadMessagesCount = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For demo purposes, using a mock count
      setUnreadMessages(2);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For demo purposes, using mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          user_id: user?.id || "",
          title: "Nouveau message",
          content: "L'agent a répondu à votre demande de devis",
          message: "L'agent a répondu à votre demande de devis",
          read: false,
          type: "message",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          reference_id: "2"
        },
        {
          id: "2",
          user_id: user?.id || "",
          title: "Devis approuvé",
          content: "Votre demande de devis a été approuvée",
          message: "Votre demande de devis a été approuvée",
          read: false,
          type: "quote",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          reference_id: "2"
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      // In a real implementation, this would update in Supabase
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === "message") {
      navigate("/messages");
    } else if (notification.type === "quote") {
      navigate("/dashboard");
    }
    
    setShowNotifications(false);
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-secondary-foreground transition">
          Déménagement Express Cotonou
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-secondary-foreground transition">
            Accueil
          </Link>
          <Link to="/services" className="hover:text-secondary-foreground transition">
            Services
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-secondary-foreground transition">Ressources</DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/checklist-demenagement")}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Checklist de déménagement</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/organiser-demenagement")}>
                <Home className="mr-2 h-4 w-4" />
                <span>Organiser son déménagement</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/contact" className="hover:text-secondary-foreground transition">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {getUnreadNotificationsCount() > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-popover text-popover-foreground rounded-md border shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b font-medium">
                      Notifications
                    </div>
                    <div className="max-h-[400px] overflow-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Aucune notification
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b cursor-pointer hover:bg-accent ${!notification.read ? 'bg-accent/30' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`h-2 w-2 mt-2 rounded-full ${!notification.read ? 'bg-primary' : 'opacity-0'}`}></div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.created_at).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/messages")} 
                className="relative"
              >
                <MessageSquare className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profile?.full_name ? profile.full_name.split(' ').map(name => name[0]).join('') : user?.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuLabel>
                    {profile?.full_name || user?.email || "Utilisateur"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/messages")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                    {unreadMessages > 0 && (
                      <Badge className="ml-auto" variant="destructive">
                        {unreadMessages}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  {(userRole === "agent" || userRole === "admin") && (
                    <DropdownMenuItem onClick={() => navigate("/agent-dashboard")}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Espace Agent</span>
                    </DropdownMenuItem>
                  )}
                  {(userRole === "moderator" || userRole === "admin") && (
                    <DropdownMenuItem onClick={() => navigate("/moderator-dashboard")}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Espace Modérateur</span>
                    </DropdownMenuItem>
                  )}
                  {userRole === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Espace Admin</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Connexion
              </Button>
              <Button onClick={() => navigate("/register")}>
                Inscription
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
