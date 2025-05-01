
import { ArrowLeftRight, Icon } from "lucide-react";

// Cette fonction sert à créer un TransferIcon puisqu'il n'existe pas dans lucide-react
export const TransferIcon = (props: React.ComponentProps<typeof Icon>) => {
  return <ArrowLeftRight {...props} />;
};
