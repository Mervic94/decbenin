
import { Layout, PageContainer } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Globe, Bell, Shield, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "DEC Bénin",
    siteEmail: "contact@decbenin.com",
    sitePhone: "+229 97 00 00 00",
    currency: "FCFA",
    language: "fr",
    maxAgentRequests: "5",
    autoAssign: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    registrationOpen: true,
    requireEmailVerification: true,
    welcomeMessage: "Bienvenue sur DEC Bénin, votre partenaire de déménagement de confiance.",
  });

  const handleSave = () => {
    toast.success("Paramètres sauvegardés avec succès");
  };

  return (
    <Layout>
    <PageContainer>
      <div className="max-w-4xl mx-auto py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin-dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Paramètres Système</h1>
              <p className="text-muted-foreground text-sm">Configurer les paramètres de l'application</p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />Enregistrer
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general"><Globe className="h-4 w-4 mr-1 hidden sm:inline" />Général</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1 hidden sm:inline" />Notifications</TabsTrigger>
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-1 hidden sm:inline" />Sécurité</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-1 hidden sm:inline" />Apparence</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>Configuration de base du site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom du site</Label>
                    <Input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email de contact</Label>
                    <Input type="email" value={settings.siteEmail} onChange={e => setSettings({ ...settings, siteEmail: e.target.value })} />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input value={settings.sitePhone} onChange={e => setSettings({ ...settings, sitePhone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Devise</Label>
                    <Select value={settings.currency} onValueChange={v => setSettings({ ...settings, currency: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FCFA">FCFA</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Max demandes par agent</Label>
                  <Input type="number" value={settings.maxAgentRequests} onChange={e => setSettings({ ...settings, maxAgentRequests: e.target.value })} className="w-32" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Attribution automatique</Label>
                    <p className="text-xs text-muted-foreground">Assigner automatiquement les demandes aux agents disponibles</p>
                  </div>
                  <Switch checked={settings.autoAssign} onCheckedChange={v => setSettings({ ...settings, autoAssign: v })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Gérer les canaux de notification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-xs text-muted-foreground">Envoyer des emails pour les mises à jour de demandes</p>
                  </div>
                  <Switch checked={settings.emailNotifications} onCheckedChange={v => setSettings({ ...settings, emailNotifications: v })} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications SMS</Label>
                    <p className="text-xs text-muted-foreground">Envoyer des SMS pour les alertes urgentes</p>
                  </div>
                  <Switch checked={settings.smsNotifications} onCheckedChange={v => setSettings({ ...settings, smsNotifications: v })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Paramètres d'accès et d'authentification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode maintenance</Label>
                    <p className="text-xs text-muted-foreground">Désactiver temporairement l'accès public</p>
                  </div>
                  <Switch checked={settings.maintenanceMode} onCheckedChange={v => setSettings({ ...settings, maintenanceMode: v })} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Inscription ouverte</Label>
                    <p className="text-xs text-muted-foreground">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                  </div>
                  <Switch checked={settings.registrationOpen} onCheckedChange={v => setSettings({ ...settings, registrationOpen: v })} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Vérification email obligatoire</Label>
                    <p className="text-xs text-muted-foreground">Exiger la confirmation par email à l'inscription</p>
                  </div>
                  <Switch checked={settings.requireEmailVerification} onCheckedChange={v => setSettings({ ...settings, requireEmailVerification: v })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>Personnaliser l'apparence du site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Message d'accueil</Label>
                  <Textarea value={settings.welcomeMessage} onChange={e => setSettings({ ...settings, welcomeMessage: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Langue par défaut</Label>
                  <Select value={settings.language} onValueChange={v => setSettings({ ...settings, language: v })}>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
    </Layout>
  );
};

export default AdminSettings;
