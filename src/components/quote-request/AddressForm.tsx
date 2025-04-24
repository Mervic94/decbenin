
import React from 'react';
import { Address } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Map from "@/components/Map";

interface AddressFormProps {
  title: string;
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  disabled?: boolean;
}

export const AddressForm = ({ title, address, onChange, disabled = false }: AddressFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${title}-street`}>Rue</Label>
          <Input
            id={`${title}-street`}
            value={address.street}
            onChange={(e) => onChange("street", e.target.value)}
            placeholder="123 Rue Principale"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-city`}>Ville</Label>
          <Input
            id={`${title}-city`}
            value={address.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Cotonou"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-zipCode`}>Code Postal</Label>
          <Input
            id={`${title}-zipCode`}
            value={address.zipCode}
            onChange={(e) => onChange("zipCode", e.target.value)}
            placeholder="01 BP 1234"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-country`}>Pays</Label>
          <Input
            id={`${title}-country`}
            value={address.country}
            onChange={(e) => onChange("country", e.target.value)}
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
