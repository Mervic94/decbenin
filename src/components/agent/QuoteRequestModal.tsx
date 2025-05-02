
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "@/components/quote/QuoteForm";

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

interface QuoteRequestModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  quoteFormData: QuoteFormData;
  setQuoteFormData: (quoteFormData: QuoteFormData) => void;
  isSubmitting: boolean;
  handleQuoteSubmit: (formData: any) => Promise<boolean>;
}

export const QuoteRequestModal = ({
  isOpen,
  onOpenChange,
  handleQuoteSubmit
}: QuoteRequestModalProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de devis</DialogTitle>
          <DialogDescription>
            Créez une nouvelle demande de devis pour un client
          </DialogDescription>
        </DialogHeader>
        <QuoteForm isModal={true} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};
