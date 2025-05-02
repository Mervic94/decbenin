
import { MoveRequest } from "@/types";

interface RequestAddressDetailsProps {
  selectedRequest: MoveRequest;
}

export const RequestAddressDetails = ({ selectedRequest }: RequestAddressDetailsProps) => {
  return (
    <>
      <div className="space-y-2">
        <h3 className="font-medium">Adresse de départ</h3>
        <div className="bg-muted rounded-md p-3">
          <p>{selectedRequest.pickupAddress.street}</p>
          <p>
            {selectedRequest.pickupAddress.city}, {selectedRequest.pickupAddress.zipCode}
          </p>
          <p>{selectedRequest.pickupAddress.country}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Adresse de destination</h3>
        <div className="bg-muted rounded-md p-3">
          <p>{selectedRequest.deliveryAddress.street}</p>
          <p>
            {selectedRequest.deliveryAddress.city}, {selectedRequest.deliveryAddress.zipCode}
          </p>
          <p>{selectedRequest.deliveryAddress.country}</p>
        </div>
      </div>
    </>
  );
};
