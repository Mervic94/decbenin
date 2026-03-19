
import { PageContainer } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, FileText, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const monthlyData = [
  { month: "Jan", demandes: 45, completees: 38 },
  { month: "Fév", demandes: 52, completees: 44 },
  { month: "Mar", demandes: 68, completees: 55 },
  { month: "Avr", demandes: 73, completees: 62 },
  { month: "Mai", demandes: 89, completees: 78 },
  { month: "Jun", demandes: 95, completees: 82 },
];

const statusData = [
  { name: "En attente", value: 15, color: "hsl(var(--secondary))" },
  { name: "Approuvées", value: 42, color: "hsl(120, 60%, 45%)" },
  { name: "Refusées", value: 8, color: "hsl(var(--destructive))" },
  { name: "Terminées", value: 82, color: "hsl(var(--primary))" },
];

const revenueData = [
  { month: "Jan", revenue: 2800000 },
  { month: "Fév", revenue: 3200000 },
  { month: "Mar", revenue: 4100000 },
  { month: "Avr", revenue: 3900000 },
  { month: "Mai", revenue: 5200000 },
  { month: "Jun", revenue: 5800000 },
];

const AdminReports = () => {
  const stats = [
    { label: "Total Demandes", value: "422", icon: FileText, trend: "+12%" },
    { label: "Utilisateurs", value: "1,254", icon: Users, trend: "+8%" },
    { label: "Taux Complétion", value: "87%", icon: TrendingUp, trend: "+3%" },
    { label: "Déménagements/mois", value: "82", icon: Truck, trend: "+15%" },
  ];

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin-dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Rapports & Statistiques</h1>
            <p className="text-muted-foreground text-sm">Vue d'ensemble des performances</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demandes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completees" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Répartition des statuts</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution du chiffre d'affaires (FCFA)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminReports;
