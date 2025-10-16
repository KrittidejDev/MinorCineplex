import { useState, useCallback, useEffect, useRef } from "react";
import { PaymentResult, QRCodeType, Charge } from "@/types/omise";

declare global {
  interface Window {
    Omise: {
      setPublicKey: (key: string) => void;
      createToken: (
        type: "card",
        cardData: Record<string, unknown>,
        callback: (statusCode: number, response: OmiseTokenResponse) => void
      ) => void;
    };
    OmiseCard: unknown;
  }
}

interface OmiseTokenResponse {
  id?: string;
  message?: string;
  [key: string]: unknown;
}

interface OmiseQRCodeResponse {
  chargeId: string;
  qrCodeUrl: string;
  error?: string;
  charge?: Charge;
  [key: string]: unknown;
}

interface OmiseChargeStatus {
  status: "pending" | "successful" | "failed";
  charge?: Charge;
}

interface UseOmisePaymentOptions {
  onSuccess?: (result?: PaymentResult) => void;
  onError?: (err: string) => void;
  onPollingUpdate?: (status: string) => void;
}

export const useOmisePayment = (options: UseOmisePaymentOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [omiseLoaded, setOmiseLoaded] = useState(false);

  const pollingRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.Omise) {
      const script = document.createElement("script");
      script.src = "https://cdn.omise.co/omise.js";
      script.async = true;
      script.onload = () => {
        window.Omise.setPublicKey(
          process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
        );
        setOmiseLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      window.Omise.setPublicKey(
        process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
      );
      setOmiseLoaded(true);
    }

    return () => stopPolling();
  }, [stopPolling]);

  const toSatang = (amount: number) => Math.round(amount * 100);

  const payWithCreditCard = useCallback(
    async (
      amount: number,
      cardData: Record<string, unknown>,
      metadata?: Record<string, unknown>
    ): Promise<PaymentResult> => {
      setLoading(true);
      setError(null);
      try {
        if (!omiseLoaded || !window.Omise)
          throw new Error("Omise.js not loaded");

        const token = await new Promise<string>((resolve, reject) => {
          window.Omise.createToken("card", cardData, (statusCode, response) => {
            const resp = response as OmiseTokenResponse;
            if (statusCode === 200 && resp.id) resolve(resp.id);
            else
              reject(
                new Error(String(resp.message || "Failed to create token"))
              );
          });
        });

        const res = await fetch("/api/omise/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: toSatang(amount), token, metadata }),
        });

        const result: OmiseQRCodeResponse = await res.json();
        if (!res.ok) throw new Error(String(result?.error || "Payment failed"));

        const charge: Charge = {
          id: result.charge?.id || "",
          object: result.charge?.object || "charge",
          amount: result.charge?.amount || toSatang(amount),
          currency: result.charge?.currency || "THB",
          status: result.charge?.status || "successful",
          paid: result.charge?.paid ?? true,
          ...result.charge,
        };

        const paymentResult: PaymentResult = {
          success: true,
          chargeId: charge.id,
          charge,
        };

        options.onSuccess?.(paymentResult);
        setLoading(false);
        return paymentResult;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        options.onError?.(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [omiseLoaded, options]
  );

  const payWithQRCode = useCallback(
    async (
      amount: number,
      type: QRCodeType = "promptpay",
      metadata?: Record<string, unknown>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/omise/qr-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: toSatang(amount), type, metadata }),
        });

        const result: OmiseQRCodeResponse = await res.json();
        if (!res.ok)
          throw new Error(
            String(result?.error || `Server error: ${res.status}`)
          );

        if (!pollingRef.current) {
          pollingRef.current = window.setInterval(async () => {
            try {
              const statusRes = await fetch(
                `/api/omise/charge-status?chargeId=${result.chargeId}`
              );
              const statusData = (await statusRes.json()) as OmiseChargeStatus;

              options.onPollingUpdate?.(statusData.status);

              if (
                statusData.status === "successful" ||
                statusData.status === "failed"
              ) {
                stopPolling();

                if (statusData.status === "successful") {
                  const charge: Charge = {
                    id: statusData.charge?.id || result.chargeId,
                    object: statusData.charge?.object || "charge",
                    amount: statusData.charge?.amount || toSatang(amount),
                    currency: statusData.charge?.currency || "THB",
                    status: statusData.charge?.status || "successful",
                    paid: statusData.charge?.paid ?? true,
                    ...statusData.charge,
                  };

                  options.onSuccess?.({
                    success: true,
                    chargeId: charge.id,
                    charge,
                  });
                } else {
                  const errMsg = `Payment ${statusData.status}`;
                  setError(errMsg);
                  options.onError?.(errMsg);
                }
              }
            } catch (err: unknown) {
              console.error("Polling error:", err);
            }
          }, 3000);
        }

        setLoading(false);
        return {
          success: true,
          qrCodeUrl: result.qrCodeUrl,
          chargeId: result.chargeId,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        options.onError?.(msg);
        setLoading(false);
        return { success: false };
      }
    },
    [options, stopPolling]
  );

  return {
    loading,
    error,
    omiseLoaded,
    payWithCreditCard,
    payWithQRCode,
    stopPolling,
  };
};
