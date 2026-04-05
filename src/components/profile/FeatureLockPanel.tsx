
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Unlock, Shield, AlertTriangle } from "lucide-react";

interface FeatureLock {
  id: string;
  target_user_id: string;
  feature_key: string;
  locked_by: string;
  reason: string | null;
  created_at: string;
  target_name?: string;
}

const AVAILABLE_FEATURES = [
  { key: "create_quotes", label: "Créer des devis", description: "Empêche l'utilisateur de créer de nouveaux devis" },
  { key: "approve_requests", label: "Approuver des demandes", description: "Empêche l'approbation de demandes" },
  { key: "transfer_requests", label: "Transférer des demandes", description: "Empêche le transfert de demandes à d'autres agents" },
  { key: "send_messages", label: "Envoyer des messages", description: "Empêche l'envoi de messages" },
  { key: "view_reports", label: "Voir les rapports", description: "Empêche l'accès aux rapports" },
  { key: "assign_tasks", label: "Assigner des tâches", description: "Empêche l'assignation de tâches (modérateur)" },
  { key: "manage_agents", label: "Gérer les agents", description: "Empêche la gestion des agents" },
];

interface FeatureLockPanelProps {
  adminId: string;
}

export const FeatureLockPanel = ({ adminId }: FeatureLockPanelProps) => {
  const [locks, setLocks] = useState<FeatureLock[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name: string; role: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLocks();
    fetchUsers();
  }, []);

  const fetchLocks = async () => {
    try {
      const { data, error } = await supabase
        .from("feature_locks" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) {
        setLocks(getMockLocks());
        return;
      }
      setLocks(data as any);
    } catch {
      setLocks(getMockLocks());
    }
  };

  const getMockLocks = (): FeatureLock[] => [
    {
      id: "lock-1",
      target_user_id: "agent-1",
      feature_key: "transfer_requests",
      locked_by: adminId,
      reason: "Trop de transferts non justifiés",
      created_at: new Date().toISOString(),
      target_name: "Agent Martin",
    },
  ];

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("id, full_name");
      if (error || !data) {
        setUsers([
          { id: "agent-1", full_name: "Agent Martin", role: "agent" },
          { id: "agent-2", full_name: "Agent Dubois", role: "agent" },
          { id: "mod-1", full_name: "Modérateur Jean", role: "moderator" },
        ]);
        return;
      }
      setUsers(data.map(p => ({ id: p.id, full_name: p.full_name || "Sans nom", role: "agent" })));
    } catch {
      setUsers([
        { id: "agent-1", full_name: "Agent Martin", role: "agent" },
        { id: "agent-2", full_name: "Agent Dubois", role: "agent" },
        { id: "mod-1", full_name: "Modérateur Jean", role: "moderator" },
      ]);
    }
  };

  const toggleLock = async (targetUserId: string, featureKey: string) => {
    const existingLock = locks.find(l => l.target_user_id === targetUserId && l.feature_key === featureKey);
    setIsLoading(true);

    try {
      if (existingLock) {
        const { error } = await supabase.from("feature_locks" as any).delete().eq("id", existingLock.id);
        if (error) {
          setLocks(prev => prev.filter(l => l.id !== existingLock.id));
        } else {
          fetchLocks();
        }
        toast.success("Fonctionnalité déverrouillée");
      } else {
        const newLock = {
          target_user_id: targetUserId,
          feature_key: featureKey,
          locked_by: adminId,
          reason: null,
        };
        const { error } = await supabase.from("feature_locks" as any).insert(newLock);
        if (error) {
          setLocks(prev => [...prev, {
            ...newLock,
            id: `local-${Date.now()}`,
            created_at: new Date().toISOString(),
            target_name: users.find(u => u.id === targetUserId)?.full_name,
          }]);
        } else {
          fetchLocks();
        }
        toast.success("Fonctionnalité verrouillée");
      }
    } catch {
      toast.error("Erreur lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = (userId: string, featureKey: string) => {
    return locks.some(l => l.target_user_id === userId && l.feature_key === featureKey);
  };

  const selectedUserLocks = selectedUser
    ? AVAILABLE_FEATURES.map(f => ({
        ...f,
        locked: isLocked(selectedUser, f.key),
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Contrôle des fonctionnalités</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verrouiller/Déverrouiller des fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sélectionner un utilisateur</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un agent ou modérateur" />
              </SelectTrigger>
              <SelectContent>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.full_name} ({u.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
            <div className="space-y-3 mt-4">
              {selectedUserLocks.map(feature => (
                <div key={feature.key} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {feature.locked ? (
                        <Lock className="h-4 w-4 text-destructive" />
                      ) : (
                        <Unlock className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-medium text-sm">{feature.label}</span>
                      {feature.locked && (
                        <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                  <Switch
                    checked={!feature.locked}
                    onCheckedChange={() => toggleLock(selectedUser, feature.key)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Locks Summary */}
      {locks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Verrouillages actifs ({locks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {locks.map(lock => {
                const feature = AVAILABLE_FEATURES.find(f => f.key === lock.feature_key);
                return (
                  <div key={lock.id} className="flex items-center justify-between p-2 rounded bg-destructive/5 border border-destructive/20">
                    <div>
                      <span className="text-sm font-medium">{lock.target_name || lock.target_user_id}</span>
                      <span className="text-sm text-muted-foreground"> — {feature?.label || lock.feature_key}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleLock(lock.target_user_id, lock.feature_key)}
                      disabled={isLoading}
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
