
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SupabaseRequestProvider } from "@/context/request/SupabaseRequestProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QuoteRequest from "./pages/QuoteRequest";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import Messages from "./pages/Messages";
import InternalMessages from "./pages/InternalMessages";
import OrganiserDemenagement from "./pages/OrganiserDemenagement";
import ChecklistDemenagement from "./pages/ChecklistDemenagement";
import CookiesPolicy from "./pages/CookiesPolicy";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminTracking from "./pages/AdminTracking";
import AdminSettings from "./pages/AdminSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SupabaseRequestProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/organiser-demenagement" element={<OrganiserDemenagement />} />
                  <Route path="/checklist-demenagement" element={<ChecklistDemenagement />} />
                  <Route path="/cookies" element={<CookiesPolicy />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/quote-request"
                    element={
                      <ProtectedRoute>
                        <QuoteRequest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/internal-messages"
                    element={
                      <ProtectedRoute>
                        <InternalMessages />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Role-based Protected Routes */}
                  <Route
                    path="/agent-dashboard"
                    element={
                      <ProtectedRoute requiredRole="agent">
                        <AgentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
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
                  
                  {/* Admin Sub-Routes */}
                  <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><AdminReports /></ProtectedRoute>} />
                  <Route path="/admin/tracking" element={<ProtectedRoute requiredRole="admin"><AdminTracking /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              <Toaster />
            </SupabaseRequestProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
