
import { Info } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

export function FAQ({ faqs }: FAQProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-demenagement-red">
      <h2 className="text-xl font-bold mb-5 flex items-center text-demenagement-red gap-2">
        <Info className="h-5 w-5" /> Foire aux questions
      </h2>
      <div className="space-y-4">
        {faqs.map((q, i) => (
          <details key={i} className="rounded border border-demenagement-red/30 px-4 py-2 cursor-pointer group">
            <summary className="font-medium text-demenagement-red focus:outline-none group-open:underline group-open:font-bold">
              {q.question}
            </summary>
            <div className="mt-2 text-sm text-muted-foreground">{q.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
