
import { useState, useEffect } from "react";
import { MoveRequest } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestContext";

export const useAgentData = () => {
  const { user, isAuthenticated, profile } = useAuth();
  const { 
    requests, 
    getPendingRequests, 
    getAssignedRequests,
    refreshRequests
  } = useRequests();
  const navigate = useNavigate();
  const [agentList, setAgentList] = useState<{ id: string, full_name: string }[]>([]);

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "agent" && user?.role !== "admin") {
      navigate("/dashboard");
    } else {
      // Fetch agents list for transfer feature
      fetchAgents();
      // Refresh requests data
      refreshRequests();
    }
  }, [isAuthenticated, user, navigate, refreshRequests]);

  const pendingRequests = getPendingRequests();
  const assignedRequests = getAssignedRequests();
  const declinedRequests = requests.filter((req) => req.status === "declined");

  // Function to fetch available agents
  const fetchAgents = async () => {
    try {
      // Dans une vraie implémentation, ceci récupérerait depuis Supabase
      setAgentList([
        { id: "agent1", full_name: "Agent 1" },
        { id: "agent2", full_name: "Agent 2" },
        { id: "agent3", full_name: "Agent 3" },
      ]);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

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
    agentList,
    getStatusBadge,
    getAssignmentBadge,
    refreshRequests
  };
};
