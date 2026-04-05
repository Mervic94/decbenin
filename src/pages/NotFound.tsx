
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, Search, ArrowLeft, Phone, FileText, 
  MapPin, HelpCircle, Truck, MessageSquare 
} from "lucide-react";

const quickLinks = [
  { label: "Accueil", path: "/", icon: Home },
  { label: "Nos Services", path: "/services", icon: Truck },
  { label: "Demander un devis", path: "/quote-request", icon: FileText },
  { label: "Contact", path: "/contact", icon: Phone },
  { label: "Organiser mon déménagement", path: "/organiser-demenagement", icon: MapPin },
  { label: "Checklist déménagement", path: "/checklist-demenagement", icon: HelpCircle },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search through known pages
      const match = quickLinks.find(link => 
        link.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        navigate(match.path);
      } else {
        navigate("/services");
      }
    }
  };

  return (
    <Layout>
      <PageContainer>
        <div className="min-h-[60vh] flex items-center justify-center py-12">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Animated 404 */}
            <div className="relative">
              <h1 className="text-[120px] md:text-[160px] font-black text-primary/10 leading-none select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Truck className="h-16 w-16 md:h-20 md:w-20 text-primary animate-bounce" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold">Page introuvable</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                La page <code className="bg-muted px-2 py-0.5 rounded text-sm">{location.pathname}</code> n'existe pas ou a été déplacée.
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <Input
                placeholder="Rechercher une page..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Quick Links */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">Liens rapides :</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickLinks.map((link) => (
                  <Link key={link.path} to={link.path}>
                    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <link.icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Page précédente
              </Button>
              <Button asChild>
                <Link to="/"><Home className="mr-2 h-4 w-4" /> Retour à l'accueil</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/contact"><MessageSquare className="mr-2 h-4 w-4" /> Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default NotFound;
