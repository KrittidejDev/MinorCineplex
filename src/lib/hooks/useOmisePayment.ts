import { useState, useEffect } from "react";

interface QRPaymentResponse {
  success: boolean;
  qrCodeUrl?: string;
  chargeId?: string;
  error?: string;
  details?: any;
}

interface OmisePaymentHook {
  loading: boolean;
  isOmiseLoaded: boolean;
  payWithCreditCard: (
    amount: number,
    cardDetails: {
      name: string;
      number: string;
      expiration_month: number;
      expiration_year: number;
      security_code: number;
    },
    metadata?: Record<string, string | number>
  ) => Promise<void>;
  payWithQRCode: (
    amount: number,
    qrCodeType: string,
    metadata?: Record<string, string | number>
  ) => Promise<QRPaymentResponse>;
  stopPolling: () => void;
}

export const useOmisePayment = ({
  onSuccess,
  onError,
  onPollingUpdate,
}: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onPollingUpdate?: (status: string) => void;
}): OmisePaymentHook => {
  const [loading, setLoading] = useState(false);
  const [isOmiseLoaded, setIsOmiseLoaded] = useState(false);

  useEffect(() => {
    const maxAttempts = 50; // ลอง 5 วินาที (50 * 100ms)
    let attempts = 0;

    const checkOmise = () => {
      if ((window as any).Omise) {
        console.log("Omise.js detected");
        setIsOmiseLoaded(true);
      } else if (attempts < maxAttempts) {
        console.log(
          `Omise.js not yet loaded, attempt ${attempts + 1}/${maxAttempts}`
        );
        attempts++;
        setTimeout(checkOmise, 100);
      } else {
        console.error("Omise.js failed to load after maximum attempts");
        onError?.("Omise.js failed to load");
      }
    };
    checkOmise();
  }, [onError]);

  const payWithCreditCard = async (
    amount: number,
    cardDetails: {
      name: string;
      number: string;
      expiration_month: number;
      expiration_year: number;
      security_code: number;
    },
    metadata?: Record<string, string | number>
  ) => {
    setLoading(true);
    try {
      console.log("Calling /api/omise/charges with:", {
        amount,
        cardDetails,
        metadata,
      });
      if (!isOmiseLoaded) throw new Error("Omise.js is not loaded yet");
      const Omise = (window as any).Omise;

      // ตรวจสอบ public key
      const publicKey = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Omise public key not configured");
      }
      Omise.setPublicKey(publicKey);
      console.log("Omise public key set:", publicKey.slice(0, 8) + "...");

      // Validate cardDetails
      if (!cardDetails.name || cardDetails.name.trim() === "") {
        throw new Error("Cardholder name is required");
      }
      if (!cardDetails.number || !/^\d{16}$/.test(cardDetails.number)) {
        throw new Error("Card number must be 16 digits");
      }
      if (
        !cardDetails.expiration_month ||
        cardDetails.expiration_month < 1 ||
        cardDetails.expiration_month > 12
      ) {
        throw new Error("Expiration month must be between 1 and 12");
      }
      if (
        !cardDetails.expiration_year ||
        cardDetails.expiration_year < new Date().getFullYear()
      ) {
        throw new Error("Expiration year is invalid or expired");
      }
      if (
        !cardDetails.security_code ||
        !/^\d{3,4}$/.test(cardDetails.security_code.toString())
      ) {
        throw new Error("Security code must be 3 or 4 digits");
      }

      // Debug payload
      const payload = {
        card: {
          name: cardDetails.name,
          number: cardDetails.number,
          expiration_month: cardDetails.expiration_month,
          expiration_year: cardDetails.expiration_year,
          security_code: cardDetails.security_code,
        },
      };
      console.log("Token payload:", payload);

      const tokenResponse: any = await new Promise((resolve, reject) => {
        Omise.createToken(
          "card",
          payload.card,
          (status: number, response: any) => {
            if (status === 200) {
              console.log("Token created successfully:", response.id);
              resolve(response);
            } else {
              console.error("Token creation failed:", response);
              reject(new Error(response.message || "Failed to create token"));
            }
          }
        );
      });

      const response = await fetch("/api/omise/charges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          token: tokenResponse.id,
          description: "Credit card payment",
          metadata,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Response error from /api/omise/charges:", {
          status: response.status,
          data,
        });
        throw new Error(data.error || "Credit card payment failed");
      }
      onSuccess?.();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Credit card payment error:", errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const payWithQRCode = async (
    amount: number,
    qrCodeType: string,
    metadata?: Record<string, string | number>
  ): Promise<QRPaymentResponse> => {
    setLoading(true);
    try {
      console.log("Calling /api/omise/qr-payment with:", {
        amount,
        qrCodeType,
        metadata,
      });
      const response = await fetch("/api/omise/qr-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: qrCodeType, metadata }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Response error from /api/omise/qr-payment:", data);
        return {
          success: false,
          error: data.error || "Failed to generate QR code",
          details: data.details,
        };
      }
      return {
        success: true,
        qrCodeUrl: data.qrCodeUrl,
        chargeId: data.chargeId,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("QR code payment error:", errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  const stopPolling = () => {
    onPollingUpdate?.("Polling stopped");
  };

  return {
    loading,
    isOmiseLoaded,
    payWithCreditCard,
    payWithQRCode,
    stopPolling,
  };
};
