
import { PageContainer } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, CheckCircle, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Map from "@/components/Map";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface TrackingItem {
  id: string;
  client: string;
  from: string;
  to: string;
  status: "preparation" | "en_route" | "livraison" | "termine";
  progress: number;
  agent: string;
  date: string;
  lat: number;
  lng: number;
}

const trackingData: TrackingItem[] = [
  { id: "DEM-001", client: "Jean Dupont", from: "Cotonou, Akpakpa", to: "Cotonou, Cadjèhoun", status: "en_route", progress: 60, agent: "Marie Koné", date: "2026-03-19", lat: 6.3702928, lng: 2.3912362 },
  { id: "DEM-002", client: "Fatou Diallo", from: "Porto-Novo", to: "Cotonou, Ganhi", status: "preparation", progress: 20, agent: "Amadou Bah", date: "2026-03-20", lat: 6.4969, lng: 2.6289 },
  { id: "DEM-003", client: "Kofi Mensah", from: "Parakou", to: "Cotonou, Zogbo", status: "livraison", progress: 90, agent: "Marie Koné", date: "2026-03-18", lat: 9.3370, lng: 2.6303 },
  { id: "DEM-004", client: "Awa Traoré", from: "Abomey-Calavi", to: "Cotonou, Fidjrossè", status: "termine", progress: 100, agent: "Amadou Bah", date: "2026-03-17", lat: 6.4485, lng: 2.3557 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof Truck }> = {
  preparation: { label: "Préparation", variant: "secondary", icon: Clock },
  en_route: { label: "En route", variant: "default", icon: Truck },
  livraison: { label: "Livraison", variant: "outline", icon: MapPin },
  termine: { label: "Terminé", variant: "default", icon: CheckCircle },
};

const AdminTracking = () => {
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin-dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Suivi des Déménagements</h1>
            <p className="text-muted-foreground text-sm">Suivre les déménagements en temps réel</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = trackingData.filter(t => t.status === key).length;
            return (
              <Card key={key}>
                <CardContent className="p-4 flex items-center gap-3">
                  <config.icon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {trackingData.map(item => {
              const config = statusConfig[item.status];
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{item.id}</span>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <p className="text-sm font-medium">{item.client}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      <p>📍 {item.from} → {item.to}</p>
                      <p>🚛 Agent: {item.agent} | 📅 {item.date}</p>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="h-fit sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Carte des déménagements actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <Map latitude={6.3702928} longitude={2.3912362} height="500px" />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminTracking;
