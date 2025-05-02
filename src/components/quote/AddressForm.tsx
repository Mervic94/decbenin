
import { Address } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Map from "@/components/Map";

interface AddressFormProps {
  title: string;
  address: Address;
  handleAddressChange: (field: keyof Address, value: string) => void;
}

export const AddressForm = ({ title, address, handleAddressChange }: AddressFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${title.toLowerCase()}-street`}>Rue</Label>
          <Input
            id={`${title.toLowerCase()}-street`}
            value={address.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            placeholder="123 Rue Principale"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title.toLowerCase()}-city`}>Ville</Label>
          <Input
            id={`${title.toLowerCase()}-city`}
            value={address.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            placeholder="Cotonou"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title.toLowerCase()}-zipCode`}>Code Postal</Label>
          <Input
            id={`${title.toLowerCase()}-zipCode`}
            value={address.zipCode}
            onChange={(e) => handleAddressChange("zipCode", e.target.value)}
            placeholder="01 BP 1234"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title.toLowerCase()}-country`}>Pays</Label>
          <Input
            id={`${title.toLowerCase()}-country`}
            value={address.country}
            onChange={(e) => handleAddressChange("country", e.target.value)}
            disabled
          />
        </div>
      </div>
      <div className="mt-4">
        <Map />
      </div>
    </div>
  );
};
