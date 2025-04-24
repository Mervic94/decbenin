
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  comment: string;
  fullName: string | null;
}

export function TestimonialCard({ comment, fullName }: TestimonialCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <p className="text-gray-600 italic mb-4">"{comment}"</p>
      <p className="text-sm font-semibold">{fullName || "Client satisfait"}</p>
    </Card>
  );
}
