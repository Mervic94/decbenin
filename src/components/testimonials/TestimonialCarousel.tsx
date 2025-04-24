
import { useAuth } from "@/context/AuthContext";
import { TestimonialList } from "./TestimonialList";
import { TestimonialForm } from "./TestimonialForm";
import { useTestimonials } from "./useTestimonials";

export function TestimonialCarousel() {
  const { user } = useAuth();
  const { testimonials, userTestimonial, isSubmitting, submitTestimonial } = useTestimonials();

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
        
        <TestimonialList testimonials={testimonials} />

        {user && !userTestimonial && (
          <TestimonialForm 
            onSubmit={submitTestimonial}
            isSubmitting={isSubmitting}
          />
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
