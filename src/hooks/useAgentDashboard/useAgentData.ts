
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/request";
import { MoveRequest } from "@/types";

export const useAgentData = () => {
  const { user, isAuthenticated, profile } = useAuth();
  const { 
    requests, 
    getPendingRequests, 
    getAssignedRequests,
    refreshRequests
  } = useRequests();
  const navigate = useNavigate();

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "agent" && user?.role !== "admin") {
      navigate("/dashboard");
    } else {
      // Refresh requests data
      refreshRequests();
    }
  }, [isAuthenticated, user, navigate, refreshRequests]);

  const pendingRequests = getPendingRequests();
  const assignedRequests = getAssignedRequests();
  const declinedRequests = requests.filter((req) => req.status === "declined");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { variant: "secondary", text: "En attente" };
      case "approved":
        return { variant: "green", text: "Approuvé" };
      case "declined":
        return { variant: "destructive", text: "Refusé" };
      case "completed":
        return { variant: "blue", text: "Terminé" };
      default:
        return { variant: "outline", text: "Inconnu" };
    }
  };

  const getAssignmentBadge = (request: MoveRequest) => {
    if (request.agent_id) {
      const isCurrentAgent = request.agent_id === user?.id;
      return {
        variant: isCurrentAgent ? "outline" : "secondary",
        className: isCurrentAgent ? "border-primary text-primary" : "",
        text: isCurrentAgent ? "Vous êtes assigné" : "Assigné à un agent"
      };
    }
    return null;
  };

  return {
    user,
    profile,
    pendingRequests,
    assignedRequests,
    declinedRequests,
    getStatusBadge,
    getAssignmentBadge,
    refreshRequests
  };
};
