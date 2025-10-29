import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useRef,
} from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { QRCodeType } from "@/types/omise";
import { useOmisePayment } from "@/lib/hooks/useOmisePayment";
import InputTextFeild from "../Inputs/InputTextFeild";
import Image from "next/image";
import { useTranslation } from "next-i18next";

interface PaymentFormProps {
  amount: number;
  metadata?: Record<string, string | number>;
  countdown: string;
  onSuccess?: () => void;
  onValidChange?: (valid: boolean) => void;
  onPaymentMethodChange?: (method: "credit_card" | "qr_code") => void;
}

export type PaymentFormHandles = {
  submitPayment: () => void;
};

type FormValues = {
  name: string;
  number: string;
  expiration: string;
  security_code: string;
};

const paymentSchema = yup.object({
  name: yup.string().trim().required("Cardholder name is required"),
  number: yup
    .string()
    .required("Card number is required")
    .matches(/^(\d{4}-){3}\d{4}$/, "Card number must be 16 digits"),
  expiration: yup
    .string()
    .required("Expiration date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY")
    .test("expiry-date", "Card has expired", (value) => {
      if (!value) return false;
      const [mm, yy] = value.split("/");
      const expMonth = parseInt(mm, 10);
      const expYear = 2000 + parseInt(yy, 10);
      const now = new Date();
      return (
        expYear > now.getFullYear() ||
        (expYear === now.getFullYear() && expMonth >= now.getMonth() + 1)
      );
    }),
  security_code: yup
    .string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "Must be 3-4 digits"),
});

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1-")
    .replace(/-$/, "");

const formatExpiration = (value: string) => {
  const raw = value.replace(/\D/g, "").slice(0, 4);
  return raw.length <= 2 ? raw : raw.slice(0, 2) + "/" + raw.slice(2);
};

const PaymentForm = forwardRef<PaymentFormHandles, PaymentFormProps>(
  (
    {
      amount,
      metadata,
      onSuccess,
      onValidChange,
      onPaymentMethodChange,
      countdown,
    },
    ref
  ) => {
    const { t } = useTranslation("common");
    const {
      control,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<FormValues>({
      resolver: yupResolver(paymentSchema),
      defaultValues: {
        name: "",
        number: "",
        expiration: "",
        security_code: "",
      },
    });

    const watchedValues = watch();

    const [paymentMethod, setPaymentMethod] = useState<
      "credit_card" | "qr_code"
    >("credit_card");
    const [qrCodeType] = useState<QRCodeType>("promptpay");
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [qrPaid, setQrPaid] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const qrCodeGeneratedRef = useRef(false);
    const prevPaymentMethodRef = useRef<string | null>(null);
    const lastOrderIdRef = useRef<string | null>(null);

    const {
      loading,
      isOmiseLoaded,
      payWithCreditCard,
      payWithQRCode,
      stopPolling,
    } = useOmisePayment({
      onSuccess: () => {
        setPaymentStatus("Payment successful!");
        setQrPaid(true);
        stopPolling();
        onSuccess?.();
      },
      onError: (error) => {
        setPaymentStatus(`Error: ${error}`);
        setQrPaid(false);
        stopPolling();
        qrCodeGeneratedRef.current = false;
      },
      onPollingUpdate: (status) =>
        setPaymentStatus(`Waiting for payment... Status: ${status}`),
    });

    useImperativeHandle(ref, () => ({
      submitPayment: () => {
        if (paymentMethod === "credit_card") handleSubmit(onSubmitCard)();
        else if (qrPaid) onSuccess?.();
      },
    }));

    const onSubmitCard = async (values: FormValues) => {
      if (!isOmiseLoaded) {
        setPaymentStatus(
          "Error: Payment system is not ready. Please try again later."
        );
        return;
      }
      try {
        setPaymentStatus("Processing...");
        const [mm, yy] = values.expiration.split("/");
        const expirationMonth = parseInt(mm, 10);
        const expirationYear = 2000 + parseInt(yy, 10);
        const securityCode = parseInt(values.security_code, 10);
        const cardNumber = values.number.replace(/\D/g, "");

        // Validate ก่อนส่ง
        if (
          isNaN(expirationMonth) ||
          expirationMonth < 1 ||
          expirationMonth > 12
        ) {
          throw new Error("Invalid expiration month");
        }
        if (
          isNaN(expirationYear) ||
          expirationYear < new Date().getFullYear()
        ) {
          throw new Error("Invalid or expired year");
        }
        if (isNaN(securityCode) || !/^\d{3,4}$/.test(values.security_code)) {
          throw new Error("Invalid security code");
        }
        if (!/^\d{16}$/.test(cardNumber)) {
          throw new Error("Card number must be 16 digits");
        }

        await payWithCreditCard(
          amount * 100,
          {
            name: values.name.trim(),
            number: cardNumber,
            expiration_month: expirationMonth,
            expiration_year: expirationYear,
            security_code: securityCode,
          },
          metadata
        );
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        setPaymentStatus(`Payment failed: ${errorMsg}`);
      }
    };

    const handleQRCodePayment = useCallback(async () => {
      if (qrCodeUrl || loading || qrCodeGeneratedRef.current) return;
      if (amount < 20) {
        setPaymentStatus("Error: Amount must be at least 20 THB");
        return;
      }
      const currentOrderId = metadata?.order_id
        ? metadata.order_id.toString()
        : null;
      if (lastOrderIdRef.current === currentOrderId) return;
      lastOrderIdRef.current = currentOrderId;
      qrCodeGeneratedRef.current = true;
      try {
        // console.log("Calling /api/omise/qr-payment with:", {
        //   amount: amount * 100,
        //   qrCodeType,
        //   metadata,
        // });
        setPaymentStatus("Generating QR code...");
        const result = await payWithQRCode(amount * 100, qrCodeType, metadata);
        if (result.success && result.qrCodeUrl) {
          setQrCodeUrl(result.qrCodeUrl);
          setPaymentStatus("Scan QR code to complete payment");
          setQrPaid(false);
        } else {
          setPaymentStatus(
            `Error: ${result.error || "Failed to generate QR code"}`
          );
          setQrPaid(false);
          qrCodeGeneratedRef.current = false;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("QR Code error:", errorMsg);
        setPaymentStatus(`Failed to generate QR code: ${errorMsg}`);
        setQrPaid(false);
        qrCodeGeneratedRef.current = false;
      }
    }, [amount, qrCodeType, metadata, payWithQRCode, qrCodeUrl, loading]);

    useEffect(() => {
      if (paymentMethod === "qr_code" && !qrCodeGeneratedRef.current) {
        handleQRCodePayment();
      } else if (paymentMethod !== "qr_code") {
        setQrCodeUrl(null);
        setQrPaid(false);
        setPaymentStatus("");
        qrCodeGeneratedRef.current = false;
        lastOrderIdRef.current = null;
        stopPolling();
      }
    }, [paymentMethod, handleQRCodePayment, stopPolling]);

    useEffect(() => {
      const cardValid =
        paymentMethod === "credit_card" &&
        isOmiseLoaded &&
        Object.keys(errors).length === 0 &&
        watchedValues.number.length === 19 &&
        watchedValues.expiration.length === 5 &&
        watchedValues.security_code.length >= 3;
      const qrValid = paymentMethod === "qr_code" && qrPaid;
      onValidChange?.(paymentMethod === "credit_card" ? cardValid : qrValid);
    }, [
      errors,
      watchedValues,
      paymentMethod,
      qrPaid,
      onValidChange,
      isOmiseLoaded,
    ]);

    useEffect(() => {
      if (
        onPaymentMethodChange &&
        paymentMethod &&
        paymentMethod !== prevPaymentMethodRef.current
      ) {
        onPaymentMethodChange(paymentMethod);
        prevPaymentMethodRef.current = paymentMethod;
      }
    }, [paymentMethod, onPaymentMethodChange]);

    return (
      <div className="flex flex-col sm:flex-1 w-full gap-4 px-4 md:px-0">
        <div className="flex gap-4">
          {["credit_card", "qr_code"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => {
                setPaymentMethod(method as "credit_card" | "qr_code");
              }}
              className={`px-1 py-1 border-b-1 transition text-f-24 ${
                paymentMethod === method
                  ? "border-gray-g63f text-white"
                  : "border-transparent text-gray-g3b0"
              }`}
            >
              {method === "credit_card" ? t("Credit Card") : t("QR Code")}
            </button>
          ))}
        </div>

        {paymentMethod === "credit_card" && (
          <div className="space-y-4">
            {!isOmiseLoaded && (
              <div className="text-red-500 text-center">
                {t("Payment system is loading. Please wait...")}
              </div>
            )}
            <div className="flex flex-col lg:flex-row lg:items-center gap-x-5">
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label={t("Card Number")}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    maxLength={19}
                    inputMode="numeric"
                    errors={errors.number?.message}
                    onChange={(e) =>
                      field.onChange(formatCardNumber(e.target.value))
                    }
                    disabled={!isOmiseLoaded}
                  />
                )}
              />
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label={t("Card Owner")}
                    placeholder="John Doe"
                    errors={errors.name?.message}
                    disabled={!isOmiseLoaded}
                  />
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-x-5">
              <Controller
                name="expiration"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label={t("Expiry Date")}
                    placeholder="MM/YY"
                    maxLength={5}
                    inputMode="numeric"
                    errors={errors.expiration?.message}
                    onChange={(e) =>
                      field.onChange(formatExpiration(e.target.value))
                    }
                    disabled={!isOmiseLoaded}
                  />
                )}
              />
              <Controller
                name="security_code"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label={t("CVC")}
                    placeholder="123"
                    maxLength={4}
                    inputMode="numeric"
                    errors={errors.security_code?.message}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    disabled={!isOmiseLoaded}
                  />
                )}
              />
            </div>
          </div>
        )}

        {paymentMethod === "qr_code" && (
          <div className="space-y-4 px-4">
            {!qrCodeUrl ? (
              <div className="w-full py-3 rounded-lg font-medium bg-gray-400 text-center text-white">
                {loading
                  ? t("Generating QR Code...")
                  : paymentStatus || "Failed to generate QR Code"}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded bg-gray-g63f p-10 flex flex-col flex-1 items-center justify-center">
                  <div className="text-gray-g3b0 text-fr-14 mb-5">
                    {t("Time remaining")} :{" "}
                    <span className="text-blue-bbee">{countdown}</span>
                  </div>
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={320}
                    height={320}
                    className="object-contain mb-5"
                    unoptimized
                  />
                  <div className="text-gray-gedd text-fr-16">
                    Minor Cineplex Public limited company
                  </div>
                  <div className="text-f-20 text-white">THB {amount}</div>
                </div>

                <p className="text-center text-gray-g3b0 text-fr-14">
                  {paymentStatus}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PaymentForm.displayName = "PaymentForm";
export default PaymentForm;
