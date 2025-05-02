
import { Layout, PageContainer } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuoteForm } from "@/components/quote/QuoteForm";

const QuoteRequest = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/quote" } });
  }

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Demande de Devis</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Détails du déménagement</CardTitle>
              <CardDescription>
                Fournissez-nous les informations nécessaires pour vous établir un devis
              </CardDescription>
            </CardHeader>
            <QuoteForm />
          </Card>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default QuoteRequest;
