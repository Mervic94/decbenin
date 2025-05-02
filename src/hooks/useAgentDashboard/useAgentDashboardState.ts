
import { useState } from "react";
import { MoveRequest, Message } from "@/types";

export const useAgentDashboardState = () => {
  const [selectedRequest, setSelectedRequest] = useState<MoveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "decline" | "assign" | "transfer" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAgentId, setTransferAgentId] = useState("");
  const [agentList, setAgentList] = useState<{ id: string, full_name: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("pending");

  return {
    selectedRequest,
    setSelectedRequest,
    isDetailsOpen,
    setIsDetailsOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    pendingAction,
    setPendingAction,
    isSubmitting,
    setIsSubmitting,
    isMessageModalOpen,
    setIsMessageModalOpen,
    messageContent,
    setMessageContent,
    isTransferModalOpen,
    setIsTransferModalOpen,
    transferAgentId,
    setTransferAgentId,
    agentList,
    setAgentList,
    messages,
    setMessages,
    activeTab,
    setActiveTab
  };
};
