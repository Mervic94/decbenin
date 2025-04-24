
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Info } from "lucide-react";

export function CallToAction() {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold mb-2 text-demenagement-red">Prêt à déménager ?</h2>
      <p className="text-muted-foreground mb-4">
        Obtenez un devis gratuit et personnalisé pour votre déménagement dès aujourd'hui.
      </p>
      <Button 
        size="lg" 
        className="bg-demenagement-red hover:bg-demenagement-darkRed text-white" 
        onClick={() => navigate("/quote")}
      >
        Demander un devis
      </Button>
      <div className="mt-6 flex justify-center items-center gap-4">
        <a href="tel:+2290166355509" className="flex items-center gap-2 text-demenagement-red font-medium hover:underline">
          <Phone className="h-5 w-5" /> +229 01 663 555 09
        </a>
        <span className="text-muted-foreground">|</span>
        <a href="mailto:demenagementexpresscotonou@gmail.com" className="flex items-center gap-2 text-demenagement-red font-medium hover:underline">
          <Info className="h-5 w-5" /> demenagementexpresscotonou@gmail.com
        </a>
      </div>
    </div>
  );
}
