
import { Layout, PageContainer } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, FileText, Truck, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardStats {
  total_users: number;
  pending_requests: number;
  approved_requests: number;
  completed_requests: number;
  declined_requests: number;
  active_agents: number;
}

interface MonthlyData {
  month: string;
  demandes: number;
  completees: number;
}

const AdminReports = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<string>("csv");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats view
      const { data: statsData, error: statsError } = await supabase
        .from("dashboard_stats")
        .select("*")
        .single();

      if (statsError) {
        console.error("Stats error:", statsError);
        // Fallback: count from tables directly
        const { count: totalRequests } = await supabase.from("move_requests").select("*", { count: "exact", head: true });
        const { count: pendingCount } = await supabase.from("move_requests").select("*", { count: "exact", head: true }).eq("status", "pending");
        const { count: approvedCount } = await supabase.from("move_requests").select("*", { count: "exact", head: true }).eq("status", "approved");
        const { count: completedCount } = await supabase.from("move_requests").select("*", { count: "exact", head: true }).eq("status", "completed");
        const { count: declinedCount } = await supabase.from("move_requests").select("*", { count: "exact", head: true }).eq("status", "declined");
        const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
        const { count: agentsCount } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "agent");

        setStats({
          total_users: usersCount || 0,
          pending_requests: pendingCount || 0,
          approved_requests: approvedCount || 0,
          completed_requests: completedCount || 0,
          declined_requests: declinedCount || 0,
          active_agents: agentsCount || 0,
        });
      } else if (statsData) {
        setStats({
          total_users: statsData.total_users || 0,
          pending_requests: statsData.pending_requests || 0,
          approved_requests: statsData.approved_requests || 0,
          completed_requests: statsData.completed_requests || 0,
          declined_requests: statsData.declined_requests || 0,
          active_agents: statsData.active_agents || 0,
        });
      }

      // Fetch requests for monthly chart
      const { data: requests } = await supabase
        .from("move_requests")
        .select("created_at, status")
        .order("created_at", { ascending: true });

      if (requests) {
        const monthMap = new Map<string, { demandes: number; completees: number }>();
        const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

        requests.forEach(r => {
          if (!r.created_at) return;
          const date = new Date(r.created_at);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          const current = monthMap.get(key) || { demandes: 0, completees: 0 };
          current.demandes++;
          if (r.status === "completed" || r.status === "approved") current.completees++;
          monthMap.set(key, current);
        });

        const monthly: MonthlyData[] = Array.from(monthMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-6)
          .map(([key, val]) => ({
            month: monthNames[parseInt(key.split("-")[1])],
            demandes: val.demandes,
            completees: val.completees,
          }));

        setMonthlyData(monthly);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscription for stats refresh
  useEffect(() => {
    const channel = supabase
      .channel("admin-reports-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "move_requests" }, () => {
        fetchData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const totalRequests = stats ? stats.pending_requests + stats.approved_requests + stats.completed_requests + stats.declined_requests : 0;
  const completionRate = totalRequests > 0 ? Math.round(((stats?.completed_requests || 0) + (stats?.approved_requests || 0)) / totalRequests * 100) : 0;

  const statusData = stats ? [
    { name: "En attente", value: stats.pending_requests, color: "hsl(var(--secondary))" },
    { name: "Approuvées", value: stats.approved_requests, color: "hsl(120, 60%, 45%)" },
    { name: "Refusées", value: stats.declined_requests, color: "hsl(var(--destructive))" },
    { name: "Terminées", value: stats.completed_requests, color: "hsl(var(--primary))" },
  ] : [];

  const statCards = [
    { label: "Total Demandes", value: totalRequests.toString(), icon: FileText },
    { label: "Utilisateurs", value: stats?.total_users?.toString() || "0", icon: Users },
    { label: "Taux Complétion", value: `${completionRate}%`, icon: TrendingUp },
    { label: "Agents actifs", value: stats?.active_agents?.toString() || "0", icon: Truck },
  ];

  const exportData = async () => {
    try {
      const { data: requests } = await supabase
        .from("move_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!requests || requests.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      if (exportFormat === "csv") {
        const headers = ["ID", "Statut", "Date Déménagement", "Description", "Agent ID", "Créé le"];
        const rows = requests.map(r => [
          r.id,
          r.status,
          r.move_date,
          `"${(r.description || "").replace(/"/g, '""')}"`,
          r.agent_id || "",
          r.created_at || "",
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        downloadBlob(blob, `rapport-demenagements-${new Date().toISOString().split("T")[0]}.csv`);
        toast.success("Export CSV téléchargé");
      } else {
        // JSON export
        const blob = new Blob([JSON.stringify(requests, null, 2)], { type: "application/json" });
        downloadBlob(blob, `rapport-demenagements-${new Date().toISOString().split("T")[0]}.json`);
        toast.success("Export JSON téléchargé");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de l'export");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
    <PageContainer>
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin-dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Rapports & Statistiques</h1>
              <p className="text-muted-foreground text-sm">Données en temps réel depuis Supabase</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />Exporter
            </Button>
            <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-80" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statCards.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demandes par mois</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="demandes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Demandes" />
                        <Bar dataKey="completees" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Complétées" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">Aucune donnée disponible</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition des statuts</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusData.some(d => d.value > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {statusData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">Aucune donnée disponible</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </PageContainer>
    </Layout>
  );
};

export default AdminReports;
