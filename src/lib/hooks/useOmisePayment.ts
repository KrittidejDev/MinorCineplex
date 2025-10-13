import { useState, useCallback, useEffect, useRef } from "react";
import { PaymentResult, QRCodeType } from "@/types/omise";

declare global {
  interface Window {
    Omise: any;
    OmiseCard: any;
  }
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

  // ใช้ number | null สำหรับ browser
  const pollingRef = useRef<number | null>(null);

  // ป้องกัน polling ซ้ำ
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // โหลด Omise script
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
      cardData: any,
      metadata?: any
    ): Promise<PaymentResult> => {
      setLoading(true);
      setError(null);
      try {
        if (!omiseLoaded || !window.Omise)
          throw new Error("Omise.js not loaded");

        const token = await new Promise<string>((resolve, reject) => {
          window.Omise.createToken(
            "card",
            cardData,
            (statusCode: number, response: any) => {
              if (statusCode === 200 && response.id) resolve(response.id);
              else
                reject(new Error(response.message || "Failed to create token"));
            }
          );
        });

        const res = await fetch("/api/omise/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: toSatang(amount), token, metadata }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Payment failed");

        const paymentResult: PaymentResult = {
          success: true,
          chargeId: result.charge.id,
          charge: result.charge,
        };

        options.onSuccess?.(paymentResult);
        setLoading(false);
        return paymentResult;
      } catch (err: any) {
        setError(err.message || "Payment failed");
        options.onError?.(err.message);
        setLoading(false);
        return { success: false, error: err.message };
      }
    },
    [omiseLoaded, options]
  );

  const payWithQRCode = useCallback(
    async (amount: number, type: QRCodeType = "promptpay", metadata?: any) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/omise/qr-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: toSatang(amount), type, metadata }),
        });

        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || `Server error: ${res.status}`);

        // เริ่ม polling status
        if (!pollingRef.current) {
          pollingRef.current = window.setInterval(async () => {
            try {
              const statusRes = await fetch(
                `/api/omise/charge-status?chargeId=${result.chargeId}`
              );
              const statusData = await statusRes.json();

              options.onPollingUpdate?.(statusData.status);

              if (
                statusData.status === "successful" ||
                statusData.status === "failed"
              ) {
                stopPolling();

                if (statusData.status === "successful") {
                  options.onSuccess?.({
                    success: true,
                    chargeId: statusData.charge.id,
                    charge: statusData.charge,
                  });
                } else {
                  const errMsg = `Payment ${statusData.status}`;
                  setError(errMsg);
                  options.onError?.(errMsg);
                }
              }
            } catch (err) {
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
      } catch (err: any) {
        setError(err.message || "Failed to create QR code");
        options.onError?.(err.message);
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
