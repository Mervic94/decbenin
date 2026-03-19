
import { Layout, PageContainer } from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Edit, Trash2, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface UserEntry {
  id: string;
  full_name: string;
  email: string;
  role: "client" | "agent" | "moderator" | "admin";
  status: "active" | "inactive";
  created_at: string;
}

const mockUsers: UserEntry[] = [
  { id: "1", full_name: "Jean Dupont", email: "jean@example.com", role: "client", status: "active", created_at: "2025-01-15" },
  { id: "2", full_name: "Marie Koné", email: "marie@example.com", role: "agent", status: "active", created_at: "2025-02-10" },
  { id: "3", full_name: "Paul Adjovi", email: "paul@example.com", role: "moderator", status: "active", created_at: "2025-03-01" },
  { id: "4", full_name: "Fatou Diallo", email: "fatou@example.com", role: "client", status: "inactive", created_at: "2025-01-20" },
  { id: "5", full_name: "Amadou Bah", email: "amadou@example.com", role: "agent", status: "active", created_at: "2025-02-28" },
];

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  moderator: "bg-purple-100 text-purple-800",
  agent: "bg-blue-100 text-blue-800",
  client: "bg-green-100 text-green-800",
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserEntry[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserEntry | null>(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", role: "client" as string });

  const filtered = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAdd = () => {
    const newUser: UserEntry = {
      id: Date.now().toString(),
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role as any,
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setIsAddOpen(false);
    setFormData({ full_name: "", email: "", role: "client" });
    toast.success("Utilisateur ajouté avec succès");
  };

  const handleEdit = () => {
    if (!editUser) return;
    setUsers(users.map(u => u.id === editUser.id ? { ...u, ...formData, role: formData.role as any } : u));
    setEditUser(null);
    setFormData({ full_name: "", email: "", role: "client" });
    toast.success("Utilisateur modifié avec succès");
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success("Utilisateur supprimé");
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  const openEdit = (user: UserEntry) => {
    setEditUser(user);
    setFormData({ full_name: user.full_name, email: user.email, role: user.role });
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin-dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground text-sm">Gérer les comptes utilisateurs, agents et modérateurs</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="moderator">Modérateur</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />Ajouter
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]} variant="secondary">
                        {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.created_at}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add / Edit Dialog */}
        <Dialog open={isAddOpen || !!editUser} onOpenChange={(open) => { if (!open) { setIsAddOpen(false); setEditUser(null); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nom complet</Label>
                <Input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <Label>Rôle</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditUser(null); }}>Annuler</Button>
              <Button onClick={editUser ? handleEdit : handleAdd}>
                {editUser ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default AdminUsers;
