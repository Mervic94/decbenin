
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SupabaseRequestProvider } from "@/context/request/SupabaseRequestProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import QuoteRequest from "./pages/QuoteRequest";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Messages from "./pages/Messages";
import InternalMessages from "./pages/InternalMessages";
import OrganiserDemenagement from "./pages/OrganiserDemenagement";
import ChecklistDemenagement from "./pages/ChecklistDemenagement";
import CookiesPolicy from "./pages/CookiesPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SupabaseRequestProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/organiser-demenagement" element={<OrganiserDemenagement />} />
                <Route path="/checklist-demenagement" element={<ChecklistDemenagement />} />
                <Route path="/cookies-policy" element={<CookiesPolicy />} />
                
                {/* Routes protégées */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/agent-dashboard" element={
                  <ProtectedRoute requiredRole="agent">
                    <AgentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/moderator-dashboard" element={
                  <ProtectedRoute requiredRole="moderator">
                    <ModeratorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/quote-request" element={
                  <ProtectedRoute>
                    <QuoteRequest />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/internal-messages" element={
                  <ProtectedRoute requiredRole="agent">
                    <InternalMessages />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SupabaseRequestProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
