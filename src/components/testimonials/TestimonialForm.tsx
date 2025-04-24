
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TestimonialFormProps {
  onSubmit: (comment: string) => Promise<void>;
  isSubmitting: boolean;
}

export function TestimonialForm({ onSubmit, isSubmitting }: TestimonialFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    await onSubmit(comment);
    setComment("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Partagez votre expérience</h3>
      <Textarea
        placeholder="Partagez votre expérience avec notre service..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-4"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting || !comment.trim()}
        className="w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Soumettre mon avis"}
      </Button>
    </div>
  );
}
