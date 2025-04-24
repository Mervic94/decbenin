
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TestimonialCard } from "./TestimonialCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Testimonial {
  id: string;
  comment: string;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export function TestimonialCarousel() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTestimonials();
    if (user) {
      loadUserTestimonial();
    }
  }, [user]);

  const loadTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading testimonials:", error);
      return;
    }

    setTestimonials(data || []);
  };

  const loadUserTestimonial = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("testimonials")
      .select()
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading user testimonial:", error);
      return;
    }

    setUserTestimonial(data);
  };

  const submitTestimonial = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un avis.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez écrire votre avis avant de soumettre.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("testimonials")
      .insert({
        user_id: user.id,
        comment: newComment.trim(),
      });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Avis déjà soumis",
          description: "Vous avez déjà soumis un avis.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la soumission de votre avis.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Merci !",
      description: "Votre avis a été enregistré avec succès.",
    });

    setNewComment("");
    loadTestimonials();
    loadUserTestimonial();
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
        
        {/* Carousel des témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              comment={testimonial.comment}
              fullName={testimonial.profiles?.full_name}
            />
          ))}
        </div>

        {/* Formulaire d'ajout de témoignage */}
        {user && !userTestimonial && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Partagez votre expérience</h3>
            <Textarea
              placeholder="Partagez votre expérience avec notre service..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4"
            />
            <Button 
              onClick={submitTestimonial} 
              disabled={isSubmitting || !newComment.trim()}
              className="w-full"
            >
              {isSubmitting ? "Envoi en cours..." : "Soumettre mon avis"}
            </Button>
          </div>
        )}

        {!user && (
          <p className="text-center text-gray-600">
            Connectez-vous pour partager votre expérience.
          </p>
        )}

        {user && userTestimonial && (
          <p className="text-center text-gray-600">
            Merci d'avoir partagé votre expérience !
          </p>
        )}
      </div>
    </div>
  );
}
