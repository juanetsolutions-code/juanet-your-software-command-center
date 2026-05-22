import { useState, useEffect } from "react";
import { app } from "@/lib/app/facade";
import type { PaymentMethod, BillingAddress } from "@/lib/dashboard/types";

export function usePayments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setPaymentMethods(app.dashboard.listPaymentMethods());
      setBillingAddress(app.dashboard.getBillingAddress());
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { paymentMethods, billingAddress, loading, error };
}
