
import { TestimonialCard } from "./TestimonialCard";

interface TestimonialListProps {
  testimonials: Array<{
    id: string;
    comment: string;
    profiles?: {
      full_name: string | null;
    } | null;
  }>;
}

export function TestimonialList({ testimonials }: TestimonialListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          comment={testimonial.comment}
          fullName={testimonial.profiles?.full_name}
        />
      ))}
    </div>
  );
}
