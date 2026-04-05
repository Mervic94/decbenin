
import { useState, useEffect } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { QuoteHistoryCard } from "@/components/profile/QuoteHistoryCard";
import { TaskAssignmentPanel } from "@/components/profile/TaskAssignmentPanel";
import { FeatureLockPanel } from "@/components/profile/FeatureLockPanel";
import { AdminWorkViewer } from "@/components/profile/AdminWorkViewer";
import { useToast } from "@/hooks/use-toast";
import { QuoteRequest } from "@/types";
import Map from "@/components/Map";
import { Shield, Users, ClipboardList, Lock, Eye, MapPin } from "lucide-react";

const Profile = () => {
  const { user, profile, userRole } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quoteHistoryLoading, setQuoteHistoryLoading] = useState(false);

  const mockQuotes: QuoteRequest[] = [
    {
      id: "1", reference: "REF-20240501", created_at: "2024-05-01T10:00:00Z",
      move_date: "2024-06-15T00:00:00Z", status: "pending", volume: 35,
      pickup_address: "123 Rue du Commerce, Cotonou",
      delivery_address: "456 Avenue des Arts, Cotonou",
      pickup_coordinates: { latitude: 6.3702, longitude: 2.3912 },
      delivery_coordinates: { latitude: 6.3802, longitude: 2.4012 }
    },
    {
      id: "2", reference: "REF-20240420", created_at: "2024-04-20T14:30:00Z",
      move_date: "2024-05-30T00:00:00Z", status: "completed", volume: 20,
      pickup_address: "789 Avenue des Palmiers, Cotonou",
      delivery_address: "101 Boulevard de la Paix, Cotonou",
      pickup_coordinates: { latitude: 6.3602, longitude: 2.3812 },
      delivery_coordinates: { latitude: 6.3902, longitude: 2.4112 }
    }
  ];

  useEffect(() => {
    const filtered = mockQuotes.filter(quote =>
      quote.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuotes(filtered);
  }, [searchTerm]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;
    setIsLoading(true);
    try {
      setTimeout(() => {
        const objectUrl = URL.createObjectURL(files[0]);
        setAvatarUrl(objectUrl);
        setIsLoading(false);
        toast({ title: "Succès", description: "Photo de profil mise à jour" });
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Erreur", description: "Échec de la mise à jour", variant: "destructive" });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast({ title: "Succès", description: "Profil mis à jour" });
    }, 1000);
  };

  const getRoleBadge = () => {
    const roles: Record<string, { label: string; color: string }> = {
      admin: { label: "Administrateur", color: "bg-red-100 text-red-800" },
      moderator: { label: "Modérateur", color: "bg-purple-100 text-purple-800" },
      agent: { label: "Agent", color: "bg-blue-100 text-blue-800" },
      user: { label: "Client", color: "bg-green-100 text-green-800" },
    };
    const role = roles[userRole || "user"];
    return <Badge className={`${role.color} text-xs`}>{role.label}</Badge>;
  };

  const getTabs = () => {
    const tabs = [
      { value: "profile", label: "Profil", icon: Users },
      { value: "quotes", label: "Mes Devis", icon: ClipboardList },
    ];

    if (userRole === "agent") {
      tabs.push({ value: "map", label: "Ma Zone", icon: MapPin });
    }

    if (userRole === "moderator") {
      tabs.push({ value: "tasks", label: "Tâches", icon: ClipboardList });
    }

    if (userRole === "admin") {
      tabs.push({ value: "tasks", label: "Tâches", icon: ClipboardList });
      tabs.push({ value: "work", label: "Travaux", icon: Eye });
      tabs.push({ value: "locks", label: "Verrouillages", icon: Lock });
    }

    return tabs;
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            {getRoleBadge()}
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 flex-wrap h-auto">
              {getTabs().map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5">
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader><CardTitle>Photo de Profil</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="w-full">
                        <Label htmlFor="avatar" className="mb-2 block">Changer de photo</Label>
                        <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} disabled={isLoading} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Informations Personnelles</CardTitle></CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nom Complet</Label>
                          <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                        </div>
                        <div>
                          <Label>Rôle</Label>
                          <Input value={userRole || "user"} disabled className="bg-muted capitalize" />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>Annuler</Button>
                          <Button onClick={handleSaveProfile} disabled={isLoading}>
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ProfileDetails user={user} profile={profile} isLoading={isLoading} setIsLoading={setIsLoading} fullName={profile?.full_name || ""} email={user?.email || ""} />
                        <div className="flex justify-end mt-4">
                          <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes">
              <QuoteHistoryCard
                isLoading={quoteHistoryLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredQuotes={filteredQuotes}
                selectedQuote={selectedQuote}
                setSelectedQuote={setSelectedQuote}
              />
              {selectedQuote && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Localisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Adresse de départ</h4>
                      <Map latitude={selectedQuote.pickup_coordinates.latitude} longitude={selectedQuote.pickup_coordinates.longitude} height="250px" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Adresse de livraison</h4>
                      <Map latitude={selectedQuote.delivery_coordinates.latitude} longitude={selectedQuote.delivery_coordinates.longitude} height="250px" />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Agent Map Tab */}
            {userRole === "agent" && (
              <TabsContent value="map">
                <Card>
                  <CardHeader><CardTitle>Ma Zone d'Opération</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-4">Vous êtes affecté à la zone de Cotonou et ses environs.</p>
                    <Map latitude={6.3702928} longitude={2.3912362} height="400px" />
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Moderator Tasks Tab - assign to agents */}
            {userRole === "moderator" && (
              <TabsContent value="tasks">
                <TaskAssignmentPanel
                  userId={user?.id || ""}
                  userRole="moderator"
                  canAssignTo="agent"
                />
              </TabsContent>
            )}

            {/* Admin Tasks Tab - assign to moderators AND agents */}
            {userRole === "admin" && (
              <>
                <TabsContent value="tasks">
                  <TaskAssignmentPanel
                    userId={user?.id || ""}
                    userRole="admin"
                    canAssignTo="both"
                  />
                </TabsContent>

                {/* Admin Work Viewer - read-only */}
                <TabsContent value="work">
                  <AdminWorkViewer />
                </TabsContent>

                {/* Admin Feature Locks */}
                <TabsContent value="locks">
                  <FeatureLockPanel adminId={user?.id || ""} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Profile;
