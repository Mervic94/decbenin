
import { PageContainer } from "@/components/Layout";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Trash2, ArrowLeft, Shield, RefreshCw, Loader2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface UserEntry {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  role: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  agent: "bg-primary/10 text-primary",
  user: "bg-secondary/10 text-secondary-foreground",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  agent: "Agent",
  user: "Utilisateur",
};

const ITEMS_PER_PAGE = 10;

type SortField = "full_name" | "created_at" | "role";
type SortDir = "asc" | "desc";

const AdminUsers = () => {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editUser, setEditUser] = useState<UserEntry | null>(null);
  const [formData, setFormData] = useState({ full_name: "", role: "user" });
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const rolesMap = new Map<string, string>();
      roles?.forEach(r => rolesMap.set(r.user_id, r.role));

      const mapped: UserEntry[] = (profiles || []).map(p => ({
        id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        created_at: p.created_at,
        role: rolesMap.get(p.id) || "user",
      }));

      setUsers(mapped);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Realtime subscription for profiles and user_roles
  useEffect(() => {
    const channel = supabase
      .channel("admin-users-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        fetchUsers();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = users.filter(u => {
      const name = u.full_name || "";
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "full_name") {
        cmp = (a.full_name || "").localeCompare(b.full_name || "");
      } else if (sortField === "created_at") {
        cmp = (a.created_at || "").localeCompare(b.created_at || "");
      } else if (sortField === "role") {
        cmp = a.role.localeCompare(b.role);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [users, search, roleFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: formData.full_name })
        .eq("id", editUser.id);

      if (profileError) throw profileError;

      if (formData.role !== editUser.role) {
        await supabase.from("user_roles").delete().eq("user_id", editUser.id);
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: editUser.id, role: formData.role as any });
        if (roleError) throw roleError;
      }

      toast.success("Utilisateur modifié avec succès");
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce profil ?")) return;
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("user_roles").delete().eq("user_id", id);
      toast.success("Profil supprimé");
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const openEdit = (user: UserEntry) => {
    setEditUser(user);
    setFormData({ full_name: user.full_name || "", role: user.role });
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground" onClick={() => toggleSort(field)}>
      {label}
      <ArrowUpDown className={`ml-1 h-3 w-3 ${sortField === field ? "text-primary" : ""}`} />
    </Button>
  );

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin-dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
              <p className="text-muted-foreground text-sm">{users.length} utilisateurs au total</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher par nom ou ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="user">Utilisateur</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><SortButton field="full_name" label="Nom" /></TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead><SortButton field="role" label="Rôle" /></TableHead>
                      <TableHead><SortButton field="created_at" label="Créé le" /></TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || "Sans nom"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge className={roleColors[user.role] || roleColors.user} variant="secondary">
                            {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                            {roleLabels[user.role] || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
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
                    {paginated.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev && p - prev > 1;
                          return (
                            <span key={p} className="flex items-center">
                              {showEllipsis && <span className="px-1 text-muted-foreground">…</span>}
                              <Button variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(p)}>
                                {p}
                              </Button>
                            </span>
                          );
                        })}
                      <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nom complet</Label>
                <Input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
              </div>
              <div>
                <Label>Rôle</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditUser(null)}>Annuler</Button>
              <Button onClick={handleEdit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default AdminUsers;
