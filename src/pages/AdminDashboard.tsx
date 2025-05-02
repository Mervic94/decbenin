
import { Layout, PageContainer } from "@/components/Layout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminModules } from "@/components/admin/AdminModules";

const AdminDashboard = () => {
  return (
    <Layout>
      <PageContainer>
        <div className="max-w-7xl mx-auto">
          <AdminHeader />
          <AdminOverview />
          <AdminModules />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default AdminDashboard;
