
import { useState } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace personnel",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pour la démonstration, afficher les identifiants des utilisateurs disponibles
  const demoAccounts = [
    { type: "Client", email: "user@example.com", password: "password" },
    { type: "Agent", email: "agent@example.com", password: "password" },
  ];

  return (
    <Layout>
      <PageContainer>
        <div className="flex justify-center items-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Connexion</CardTitle>
              <CardDescription className="text-center">
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Mot de passe oublié?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                </Button>
                <p className="mt-4 text-center text-sm">
                  Vous n'avez pas de compte?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:underline font-medium"
                  >
                    Créer un compte
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Demo accounts info - only for demonstration */}
        <div className="max-w-md mx-auto mt-8 p-4 border border-dashed border-gray-300 rounded-md">
          <h3 className="font-medium text-lg mb-2">Comptes de démonstration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pour tester l'application, utilisez l'un des comptes suivants:
          </p>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                <p><strong>{account.type}:</strong> {account.email}</p>
                <p><strong>Mot de passe:</strong> {account.password}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Login;
