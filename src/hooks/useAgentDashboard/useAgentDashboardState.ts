
import { useState } from "react";
import { MoveRequest } from "@/types";

interface QuoteFormData {
  pickupAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  moveDate: Date | undefined;
  description: string;
  items: string;
}

export const useAgentDashboardState = () => {
  const [selectedRequest, setSelectedRequest] = useState<MoveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "decline" | "assign" | "transfer" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Messages modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  
  // Transfer modal state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAgentId, setTransferAgentId] = useState("");
  const [agentList, setAgentList] = useState<{ id: string, full_name: string }[]>([]);
  
  // Active tab
  const [activeTab, setActiveTab] = useState("pending");
  
  // Quote request modal state
  const [isQuoteRequestModalOpen, setIsQuoteRequestModalOpen] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState<QuoteFormData>({
    pickupAddress: {
      street: "",
      city: "",
      zipCode: "",
      country: "Bénin",
    },
    deliveryAddress: {
      street: "",
      city: "",
      zipCode: "",
      country: "Bénin",
    },
    moveDate: undefined,
    description: "",
    items: "",
  });

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
    setActiveTab,
    isQuoteRequestModalOpen,
    setIsQuoteRequestModalOpen,
    quoteFormData,
    setQuoteFormData
  };
};
