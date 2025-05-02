
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestForm from "./pages/QuoteRequest";
import AgentDashboard from "./pages/AgentDashboard";
import CookiesPolicy from "./pages/CookiesPolicy";
import AdminDashboard from "./pages/AdminDashboard";
import InternalMessages from "./pages/InternalMessages";
import Messages from "./pages/Messages";
import Services from "./pages/Services";
import ChecklistDemenagement from "./pages/ChecklistDemenagement";
import OrganiserDemenagement from "./pages/OrganiserDemenagement";
import NotFound from "./pages/NotFound";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  const { userRole } = useAuth();
  
  // Redirect user based on role when they log in
  const getUserHomePage = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "moderator":
        return <ModeratorDashboard />;
      case "agent":
        return <AgentDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<ProtectedRoute>{getUserHomePage()}</ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/request" element={<RequestForm />} />
      <Route path="/quote" element={<RequestForm />} />
      <Route 
        path="/agent-dashboard" 
        element={
          <ProtectedRoute requiredRole="agent">
            <AgentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/moderator-dashboard"
        element={
          <ProtectedRoute requiredRole="moderator">
            <ModeratorDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/cookies-policy" element={<CookiesPolicy />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/internal-messages" element={<InternalMessages />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/services" element={<Services />} />
      <Route path="/checklist-demenagement" element={<ChecklistDemenagement />} />
      <Route path="/organiser-demenagement" element={<OrganiserDemenagement />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
