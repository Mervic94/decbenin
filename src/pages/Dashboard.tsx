
import { useEffect } from "react";
import { Layout, PageContainer } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/request";

// Import the new components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RequestsList } from "@/components/dashboard/RequestsList";

const Dashboard = () => {
  const { user, isAuthenticated, profile } = useAuth();
  const { getUserRequests } = useRequests();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const userRequests = getUserRequests();

  if (!user) return null;

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <DashboardHeader fullName={profile?.full_name} />
          <DashboardStats requests={userRequests} />

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Vos demandes de déménagement</h2>
            <RequestsList requests={userRequests} />
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Dashboard;
