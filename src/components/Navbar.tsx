
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Package, LogOut, FileText, Home } from "lucide-react";

export const Navbar = () => {
  const { user, profile, userRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-secondary-foreground transition">
          Déménagement Express Cotonou
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-secondary-foreground transition">
            Accueil
          </Link>
          <Link to="/services" className="hover:text-secondary-foreground transition">
            Services
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-secondary-foreground transition">Ressources</DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/checklist-demenagement")}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Checklist de déménagement</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/organiser-demenagement")}>
                <Home className="mr-2 h-4 w-4" />
                <span>Organiser son déménagement</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/contact" className="hover:text-secondary-foreground transition">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuLabel>
                  {profile?.full_name || "Utilisateur"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Tableau de bord</span>
                </DropdownMenuItem>
                {userRole === "agent" && (
                  <DropdownMenuItem onClick={() => navigate("/agent")}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Espace Agent</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Connexion
              </Button>
              <Button onClick={() => navigate("/register")}>
                Inscription
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
