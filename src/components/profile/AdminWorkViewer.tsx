
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Briefcase, Users, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WorkItem {
  id: string;
  title: string;
  status: string;
  user_name: string;
  user_role: string;
  created_at: string;
  details?: string;
}

export const AdminWorkViewer = () => {
  const [agentWork, setAgentWork] = useState<WorkItem[]>([]);
  const [moderatorWork, setModeratorWork] = useState<WorkItem[]>([]);

  useEffect(() => {
    fetchWork();
  }, []);

  const fetchWork = async () => {
    // Try fetching from Supabase, fallback to mock
    try {
      const { data: requests } = await supabase
        .from("move_requests")
        .select("*")
        .not("agent_id", "is", null)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (requests && requests.length > 0) {
        setAgentWork(requests.map((r: any) => ({
          id: r.id,
          title: `Demande #${r.id.slice(0, 8)}`,
          status: r.status,
          user_name: r.agent_id || "Agent",
          user_role: "agent",
          created_at: r.created_at,
          details: r.description,
        })));
      } else {
        setAgentWork(getMockAgentWork());
      }
    } catch {
      setAgentWork(getMockAgentWork());
    }

    setModeratorWork(getMockModeratorWork());
  };

  const getMockAgentWork = (): WorkItem[] => [
    { id: "aw-1", title: "Déménagement résidentiel - Cotonou", status: "approved", user_name: "Agent Martin", user_role: "agent", created_at: new Date(Date.now() - 86400000).toISOString(), details: "Déménagement 3 pièces vers Akpakpa" },
    { id: "aw-2", title: "Déménagement commercial - Porto-Novo", status: "pending", user_name: "Agent Dubois", user_role: "agent", created_at: new Date(Date.now() - 86400000 * 2).toISOString(), details: "Transfert de bureau" },
    { id: "aw-3", title: "Déménagement international - Paris", status: "completed", user_name: "Agent Martin", user_role: "agent", created_at: new Date(Date.now() - 86400000 * 5).toISOString(), details: "Export conteneur 20 pieds" },
  ];

  const getMockModeratorWork = (): WorkItem[] => [
    { id: "mw-1", title: "Distribution de 12 devis", status: "completed", user_name: "Mod. Jean", user_role: "moderator", created_at: new Date(Date.now() - 86400000).toISOString(), details: "Devis résidentiels distribués aux agents" },
    { id: "mw-2", title: "Réaffectation agent zone Nord", status: "in_progress", user_name: "Mod. Jean", user_role: "moderator", created_at: new Date(Date.now() - 86400000 * 2).toISOString(), details: "Transfert des dossiers de Agent X à Agent Y" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: "En attente" },
      approved: { variant: "default", label: "Approuvé" },
      in_progress: { variant: "outline", label: "En cours" },
      completed: { variant: "default", label: "Terminé" },
      declined: { variant: "destructive", label: "Refusé" },
    };
    const info = map[status] || { variant: "outline" as const, label: status };
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Consultation des travaux (lecture seule)</h3>
      </div>

      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Travaux Agents
          </TabsTrigger>
          <TabsTrigger value="moderators" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Travaux Modérateurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-3 mt-4">
          {agentWork.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{item.title}</span>
                      {statusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {item.user_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.created_at), "d MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="moderators" className="space-y-3 mt-4">
          {moderatorWork.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{item.title}</span>
                      {statusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {item.user_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.created_at), "d MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
