
import { toast } from "sonner";
import { useRequests } from "@/context/request";

export const useAgentQuoteManagement = (
  user: any,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setIsQuoteRequestModalOpen: (isOpen: boolean) => void,
  refreshRequests: () => void
) => {
  const { createRequest } = useRequests();

  const handleQuoteSubmit = async (formData: any) => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      const { pickupAddress, deliveryAddress, moveDate, description, items } = formData;
      const itemsList = items.split(',').map((item: string) => item.trim()).filter(Boolean);
      
      const success = await createRequest(
        pickupAddress,
        deliveryAddress,
        moveDate,
        description,
        itemsList
      );
      
      if (success) {
        toast.success("Demande de devis créée avec succès");
        setIsQuoteRequestModalOpen(false);
        refreshRequests();
        return true;
      } else {
        toast.error("Une erreur est survenue lors de la création de la demande de devis");
        return false;
      }
    } catch (error) {
      console.error("Error creating quote request:", error);
      toast.error("Une erreur est survenue lors de la création de la demande de devis");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleQuoteSubmit
  };
};
