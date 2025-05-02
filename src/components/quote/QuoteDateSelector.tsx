
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

interface QuoteDateSelectorProps {
  moveDate: Date | undefined;
  setMoveDate: (date: Date | undefined) => void;
}

export const QuoteDateSelector = ({ moveDate, setMoveDate }: QuoteDateSelectorProps) => {
  // Disable past dates for calendar
  const disabledDays = [
    { before: new Date() }
  ];

  return (
    <div className="space-y-2">
      <Label>Date de déménagement</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !moveDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {moveDate ? (
              format(moveDate, "PPP", { locale: fr })
            ) : (
              <span>Sélectionnez une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={moveDate}
            onSelect={setMoveDate}
            disabled={disabledDays}
            locale={fr}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
