
import { useAuth } from "@/context/AuthContext";
import { TestimonialList } from "./TestimonialList";
import { TestimonialForm } from "./TestimonialForm";
import { useTestimonials } from "./useTestimonials";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { TestimonialCard } from "./TestimonialCard";

export function TestimonialCarousel() {
  const { user } = useAuth();
  const { testimonials, userTestimonial, isSubmitting, submitTestimonial } = useTestimonials();

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
        
        {testimonials.length > 0 ? (
          <div className="max-w-5xl mx-auto mb-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                    <TestimonialCard 
                      comment={testimonial.comment} 
                      fullName={testimonial.profiles?.full_name}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative static" />
                <CarouselNext className="relative static" />
              </div>
            </Carousel>
          </div>
        ) : (
          <TestimonialList testimonials={testimonials} />
        )}

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
