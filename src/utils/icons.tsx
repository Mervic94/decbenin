
import { ArrowLeftRight, Icon } from "lucide-react";
import type { LucideProps } from "lucide-react";

// This function creates a TransferIcon since it doesn't exist in lucide-react
export const TransferIcon = (props: LucideProps) => {
  return <ArrowLeftRight {...props} />;
};
