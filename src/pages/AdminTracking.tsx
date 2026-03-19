
import { PageContainer } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, CheckCircle, Truck, RefreshCw, Filter, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Map from "@/components/Map";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Address } from "@/types";

interface TrackingItem {
  id: string;
  client_name: string | null;
  agent_name: string | null;
  pickup_address: Address;
  delivery_address: Address;
  status: string;
  move_date: string;
  created_at: string | null;
  description: string | null;
  items: string[] | null;
}

const statusProgress: Record<string, number> = {
  pending: 10,
  approved: 40,
  in_progress: 70,
  completed: 100,
  declined: 0,
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof Truck }> = {
  pending: { label: "En attente", variant: "secondary", icon: Clock },
  approved: { label: "Approuvé", variant: "default", icon: Truck },
  in_progress: { label: "En cours", variant: "outline", icon: MapPin },
  completed: { label: "Terminé", variant: "default", icon: CheckCircle },
  declined: { label: "Refusé", variant: "destructive", icon: Clock },
};

const AdminTracking = () => {
  const [items, setItems] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<TrackingItem | null>(null);
  const [selectedMapItem, setSelectedMapItem] = useState<TrackingItem | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: requests, error } = await supabase
        .from("move_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for client and agent names
      const userIds = new Set<string>();
      requests?.forEach(r => {
        userIds.add(r.user_id);
        if (r.agent_id) userIds.add(r.agent_id);
      });

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", Array.from(userIds));

      const profileLookup: Record<string, string> = {};
      profiles?.forEach(p => { profileLookup[p.id] = p.full_name || "Sans nom"; });

      const mapped: TrackingItem[] = (requests || []).map(r => ({
        id: r.id,
        client_name: profileLookup[r.user_id] || "Client inconnu",
        agent_name: r.agent_id ? (profileLookup[r.agent_id] || "Agent inconnu") : null,
        pickup_address: r.pickup_address as unknown as Address,
        delivery_address: r.delivery_address as unknown as Address,
        status: r.status,
        move_date: r.move_date,
        created_at: r.created_at,
        description: r.description,
        items: r.items,
      }));

      setItems(mapped);
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = items.filter(i => statusFilter === "all" || i.status === statusFilter);
  const activeItems = items.filter(i => i.status !== "declined" && i.status !== "completed");

  const statusCounts = {
    pending: items.filter(i => i.status === "pending").length,
    approved: items.filter(i => i.status === "approved").length,
    in_progress: items.filter(i => i.status === "in_progress").length,
    completed: items.filter(i => i.status === "completed").length,
  };

  const getAddressString = (addr: Address | null) => {
    if (!addr) return "Adresse inconnue";
    return [addr.street, addr.city, addr.zipCode, addr.country].filter(Boolean).join(", ");
  };

  // Default map center: Cotonou
  const mapCenter = selectedMapItem?.pickup_address
    ? { lat: 6.3702928, lng: 2.3912362 }
    : { lat: 6.3702928, lng: 2.3912362 };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin-dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Suivi des Déménagements</h1>
              <p className="text-muted-foreground text-sm">{items.length} déménagements au total, {activeItems.length} actifs</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Status counts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusConfig).filter(([key]) => key !== "declined").map(([key, config]) => (
            <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(key === statusFilter ? "all" : key)}>
              <CardContent className="p-4 flex items-center gap-3">
                <config.icon className={`h-8 w-8 ${key === statusFilter ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-2xl font-bold">{statusCounts[key as keyof typeof statusCounts]}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvé</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="declined">Refusé</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} résultat(s)</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
            <Skeleton className="h-[500px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filtered.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Aucun déménagement trouvé
                  </CardContent>
                </Card>
              ) : (
                filtered.map(item => {
                  const config = statusConfig[item.status] || statusConfig.pending;
                  const progress = statusProgress[item.status] || 0;
                  return (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${selectedMapItem?.id === item.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedMapItem(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm font-mono">#{item.id.slice(0, 8)}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={config.variant}>{config.label}</Badge>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm font-medium">{item.client_name}</p>
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <p>📍 {getAddressString(item.pickup_address)} → {getAddressString(item.delivery_address)}</p>
                          <p>📅 {format(new Date(item.move_date), "d MMM yyyy", { locale: fr })}
                            {item.agent_name && <> | 🚛 {item.agent_name}</>}
                          </p>
                        </div>
                        {item.status !== "declined" && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progression</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            <Card className="h-fit sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedMapItem ? `Localisation — ${selectedMapItem.client_name}` : "Carte des déménagements"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Map latitude={mapCenter.lat} longitude={mapCenter.lng} height="500px" />
                {selectedMapItem && (
                  <div className="mt-4 text-sm space-y-1">
                    <p><strong>Départ:</strong> {getAddressString(selectedMapItem.pickup_address)}</p>
                    <p><strong>Arrivée:</strong> {getAddressString(selectedMapItem.delivery_address)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => { if (!open) setSelectedItem(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Détails du déménagement</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">#{selectedItem.id.slice(0, 8)}</span>
                  <Badge variant={statusConfig[selectedItem.status]?.variant || "secondary"}>
                    {statusConfig[selectedItem.status]?.label || selectedItem.status}
                  </Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{selectedItem.client_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Agent</p>
                    <p className="font-medium">{selectedItem.agent_name || "Non assigné"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date prévue</p>
                    <p className="font-medium">{format(new Date(selectedItem.move_date), "d MMMM yyyy", { locale: fr })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Créé le</p>
                    <p className="font-medium">{selectedItem.created_at ? format(new Date(selectedItem.created_at), "d MMM yyyy", { locale: fr }) : "—"}</p>
                  </div>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Départ</p>
                  <p>{getAddressString(selectedItem.pickup_address)}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Arrivée</p>
                  <p>{getAddressString(selectedItem.delivery_address)}</p>
                </div>
                {selectedItem.description && (
                  <>
                    <Separator />
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Description</p>
                      <p>{selectedItem.description}</p>
                    </div>
                  </>
                )}
                {selectedItem.items && selectedItem.items.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.items.map((item, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                )}
                <Map latitude={mapCenter.lat} longitude={mapCenter.lng} height="200px" />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default AdminTracking;
