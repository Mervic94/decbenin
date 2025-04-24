
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  comment: string;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

export function useTestimonials() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTestimonials = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, content as comment, user_id, created_at, profiles:profiles(full_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading testimonials:", error);
      return;
    }

    setTestimonials(data as Testimonial[] || []);
  };

  const loadUserTestimonial = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("posts")
      .select("id, content as comment, user_id, created_at, profiles:profiles(full_name)")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading user testimonial:", error);
      return;
    }

    setUserTestimonial(data as Testimonial | null);
  };

  const submitTestimonial = async (comment: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un avis.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez écrire votre avis avant de soumettre.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content: comment.trim(),
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

    await Promise.all([loadTestimonials(), loadUserTestimonial()]);
  };

  useEffect(() => {
    loadTestimonials();
    if (user) {
      loadUserTestimonial();
    }
  }, [user]);

  return {
    testimonials,
    userTestimonial,
    isSubmitting,
    submitTestimonial,
  };
}
