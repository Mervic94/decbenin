
import { Layout, PageContainer } from "@/components/Layout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminModules } from "@/components/admin/AdminModules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-7xl mx-auto">
          <AdminHeader />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="mb-8 w-full grid grid-cols-3 md:grid-cols-5 lg:w-auto">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="moderators">Modérateurs</TabsTrigger>
              <TabsTrigger value="requests">Demandes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques globales</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminOverview />
                  <AdminModules />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interface de gestion des comptes utilisateurs.
                  </p>
                  {/* Contenu à implémenter */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="agents">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interface de gestion des comptes agents.
                  </p>
                  {/* Contenu à implémenter */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="moderators">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des modérateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interface de gestion des comptes modérateurs.
                  </p>
                  {/* Contenu à implémenter */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Demandes de déménagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interface de gestion des demandes de déménagement.
                  </p>
                  {/* Contenu à implémenter */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default AdminDashboard;
