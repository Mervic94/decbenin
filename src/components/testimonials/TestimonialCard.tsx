
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

interface TestimonialCardProps {
  comment: string;
  fullName: string | null;
}

export function TestimonialCard({ comment, fullName }: TestimonialCardProps) {
  // Get initials for the avatar
  const initials = fullName
    ? fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'CL';

  return (
    <Card className="p-6 bg-white shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{fullName || "Client satisfait"}</p>
        </div>
      </div>
      
      <div className="flex-grow">
        <QuoteIcon className="h-6 w-6 text-gray-300 mb-2" />
        <p className="text-gray-600 italic">{comment}</p>
      </div>
    </Card>
  );
}
