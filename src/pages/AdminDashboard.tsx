
import { useEffect, useState } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, Profile } from "@/types";
import { ChartBar, Users, MessageSquare, UserCog } from "lucide-react";

interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
}

interface AgentStats {
  agent_id: string;
  agent_name: string;
  requests_handled: number;
  approved_requests: number;
  declined_requests: number;
}

const AdminDashboard = () => {
  const { user, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  
  const [agentStats, setAgentStats] = useState<AgentStats[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState(0);
  const [declinedRequests, setDeclinedRequests] = useState(0);

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    } 
    
    if (userRole !== "admin") {
      navigate("/dashboard");
      return;
    }
    
    fetchUsers();
    fetchStatistics();
  }, [isAuthenticated, userRole, navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Pour la démonstration, utilisons des données fictives
      // Dans une implémentation réelle, cela récupérerait depuis Supabase
      const mockUsers: UserWithRole[] = [
        {
          id: "user1",
          email: "user@example.com",
          role: "user",
          full_name: "Utilisateur Test",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "agent1",
          email: "agent@moveit.com",
          role: "agent",
          full_name: "Agent Demo",
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "admin1",
          email: "admin@moveit.com",
          role: "admin",
          full_name: "Admin Demo",
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error("Impossible de charger la liste des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Données fictives pour les statistiques
      setTotalRequests(125);
      setPendingRequests(15);
      setApprovedRequests(95);
      setDeclinedRequests(15);
      
      const mockAgentStats: AgentStats[] = [
        {
          agent_id: "agent1",
          agent_name: "Agent Demo",
          requests_handled: 45,
          approved_requests: 38,
          declined_requests: 7
        },
        {
          agent_id: "agent2",
          agent_name: "Agent 2",
          requests_handled: 50,
          approved_requests: 42,
          declined_requests: 8
        }
      ];
      
      setAgentStats(mockAgentStats);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    }
  };

  const handleOpenRoleDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      // Dans une implémentation réelle, cela mettrait à jour dans Supabase
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
      
      toast.success(`Le rôle de ${selectedUser.full_name || selectedUser.email} a été mis à jour avec succès`);
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast.error("Impossible de mettre à jour le rôle de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = searchTerm 
    ? users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : users;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "agent":
        return <Badge className="bg-blue-500">Agent</Badge>;
      default:
        return <Badge className="bg-gray-500">Utilisateur</Badge>;
    }
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Espace Administrateur</h1>
              <p className="text-muted-foreground">
                Gérez les utilisateurs, suivez les statistiques et supervisez les activités
              </p>
            </div>
            <Button onClick={() => fetchUsers()}>Actualiser</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total des demandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ChartBar className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{totalRequests}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  En attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-yellow-400 mr-2" />
                  <div className="text-2xl font-bold">{pendingRequests}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approuvées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-500 mr-2" />
                  <div className="text-2xl font-bold">{approvedRequests}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Refusées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-red-500 mr-2" />
                  <div className="text-2xl font-bold">{declinedRequests}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="stats">
                <ChartBar className="h-4 w-4 mr-2" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
                <div className="w-1/3">
                  <Input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom / Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            Chargement des utilisateurs...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            Aucun utilisateur trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.full_name || "Sans nom"}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenRoleDialog(user)}
                              >
                                <UserCog className="h-4 w-4 mr-2" />
                                Modifier le rôle
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <h2 className="text-xl font-semibold">Statistiques des Agents</h2>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Demandes traitées</TableHead>
                        <TableHead>Approuvées</TableHead>
                        <TableHead>Refusées</TableHead>
                        <TableHead>Taux d'approbation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentStats.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Aucune statistique disponible
                          </TableCell>
                        </TableRow>
                      ) : (
                        agentStats.map((stats) => (
                          <TableRow key={stats.agent_id}>
                            <TableCell className="font-medium">{stats.agent_name}</TableCell>
                            <TableCell>{stats.requests_handled}</TableCell>
                            <TableCell className="text-green-600">{stats.approved_requests}</TableCell>
                            <TableCell className="text-red-600">{stats.declined_requests}</TableCell>
                            <TableCell>
                              {stats.requests_handled > 0
                                ? `${Math.round((stats.approved_requests / stats.requests_handled) * 100)}%`
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="my-8">
                <h3 className="text-lg font-semibold mb-4">Graphiques de Performance</h3>
                <p className="text-muted-foreground mb-4">Les graphiques de performance seront disponibles dans une version ultérieure.</p>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <h2 className="text-xl font-semibold">Messagerie Interne</h2>
              <p>La messagerie interne sera implémentée dans une version future. Elle permettra aux administrateurs de communiquer avec les agents.</p>
              <Button onClick={() => navigate("/internal-messages")}>
                Accéder à la messagerie interne
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modification du rôle utilisateur</DialogTitle>
              <DialogDescription>
                Changez le rôle de {selectedUser?.full_name || selectedUser?.email}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsRoleDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleUpdateRole} 
                disabled={isLoading}
              >
                {isLoading ? "Mise à jour..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </Layout>
  );
};

export default AdminDashboard;
