
import { useState } from "react";

export interface EstimationInput {
  cartons: number;
  pieces: number;
  volumesSpecifiques: string;
  clientEmail: string;
}

export interface EstimationResult {
  success: boolean;
  message: string;
}

export function useQuoteEstimation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);

  const sendEstimation = async (input: EstimationInput) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/functions/quote-estimation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      setResult({ success: response.ok, message: data.message });
      setLoading(false);
      return response.ok;
    } catch (err) {
      setResult({ success: false, message: "Erreur réseau ou serveur." });
      setLoading(false);
      return false;
    }
  };

  return { loading, result, sendEstimation };
}
