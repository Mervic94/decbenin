
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

// Mock testimonials for demo purposes
const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    comment: "Service exceptionnel ! Mon déménagement s'est déroulé sans aucun problème. L'équipe était professionnelle et efficace.",
    user_id: "user1",
    created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    profiles: {
      full_name: "Jean Dupont"
    }
  },
  {
    id: "2",
    comment: "Je recommande vivement Déménagement Express Cotonou. Prix transparent, service impeccable et personnel très courtois.",
    user_id: "user2",
    created_at: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    profiles: {
      full_name: "Marie Koumara"
    }
  },
  {
    id: "3",
    comment: "Ponctualité, soin et professionnalisme. Merci pour avoir pris soin de mes affaires pendant ce déménagement international.",
    user_id: "user3",
    created_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    profiles: {
      full_name: "Paul Mensah"
    }
  }
];

export function useTestimonials() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTestimonials = async () => {
    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from("posts")
        .select("id, content as comment, user_id, created_at, profiles:profiles(full_name)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setTestimonials(data as unknown as Testimonial[]);
      } else {
        // If no data or error from Supabase, use mock data
        setTestimonials(mockTestimonials);
      }
    } catch (error) {
      console.error("Error loading testimonials:", error);
      // Fallback to mock data on error
      setTestimonials(mockTestimonials);
    }
  };

  const loadUserTestimonial = async () => {
    if (!user) return;

    try {
      // For demo users, check if they've already left a testimonial in our mock data
      if (user.id.includes('demo-id') && user.id === 'client-demo-id') {
        const existingTestimonial = mockTestimonials.find(t => t.user_id === 'client-demo-id');
        if (existingTestimonial) {
          setUserTestimonial(existingTestimonial);
          return;
        }
      }

      // Try real database for non-demo users
      const { data, error } = await supabase
        .from("posts")
        .select("id, content as comment, user_id, created_at, profiles:profiles(full_name)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setUserTestimonial(data as unknown as Testimonial);
      }
    } catch (error) {
      console.error("Error loading user testimonial:", error);
    }
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

    try {
      // For demo user, simulate adding a testimonial
      if (user.id.includes('demo-id')) {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newTestimonial: Testimonial = {
          id: `demo-${Date.now()}`,
          user_id: user.id,
          comment: comment.trim(),
          created_at: new Date().toISOString(),
          profiles: {
            full_name: user.id === 'client-demo-id' ? 'Client Demo' : 'Utilisateur Demo'
          }
        };
        
        setTestimonials(prev => [newTestimonial, ...prev]);
        setUserTestimonial(newTestimonial);
        
        setIsSubmitting(false);
        
        toast({
          title: "Merci !",
          description: "Votre avis a été enregistré avec succès.",
        });
        
        return;
      }

      // Real submission for non-demo users
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
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre avis.",
        variant: "destructive",
      });
    }
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
