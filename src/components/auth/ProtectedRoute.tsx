import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "moderator" | "agent" | "user";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // If user is admin, they can access any page
    if (userRole === "admin") {
      return <>{children}</>;
    }
    
    // Otherwise, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
