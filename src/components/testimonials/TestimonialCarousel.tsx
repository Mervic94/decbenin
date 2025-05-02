
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
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function TestimonialCarousel() {
  const { user } = useAuth();
  const { testimonials, userTestimonial, isSubmitting, submitTestimonial } = useTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
                startIndex: activeIndex
              }}
              className="w-full"
              setApi={(api) => {
                if (api) {
                  api.scrollTo(activeIndex);
                }
              }}
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <TestimonialCard 
                        comment={testimonial.comment} 
                        fullName={testimonial.profiles?.full_name}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 gap-4">
                <CarouselPrevious className="relative static" />
                <CarouselNext className="relative static" />
              </div>
            </Carousel>
            <div className="flex justify-center mt-4 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === activeIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
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
          <div className="text-center max-w-md mx-auto">
            <p className="mb-4 text-gray-600">
              Connectez-vous pour partager votre expérience avec notre service.
            </p>
            <Button asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter pour laisser un avis
              </Link>
            </Button>
          </div>
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
