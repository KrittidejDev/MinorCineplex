import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { QRCodeType } from "@/types/omise";
import { useOmisePayment } from "@/lib/hooks/useOmisePayment";
import InputTextFeild from "../Inputs/InputTextFeild";

interface PaymentFormProps {
  amount: number;
  metadata?: Record<string, any>;
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
    const [qrCodeType, setQrCodeType] = useState<QRCodeType>("promptpay");
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [qrPaid, setQrPaid] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");

    const { loading, payWithCreditCard, payWithQRCode, stopPolling } =
      useOmisePayment({
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
      try {
        setPaymentStatus("Processing...");
        const [mm, yy] = values.expiration.split("/");
        await payWithCreditCard(
          amount,
          {
            name: values.name,
            number: values.number.replace(/\D/g, ""),
            expiration_month: mm,
            expiration_year: "20" + yy,
            security_code: values.security_code,
          },
          metadata
        );
      } catch {
        setPaymentStatus("Payment failed");
      }
    };

    const handleQRCodePayment = async () => {
      try {
        if (qrCodeUrl) return; // ป้องกัน loop
        setPaymentStatus("Generating QR code...");
        const result = await payWithQRCode(amount, qrCodeType, metadata);
        if (result.success && result.qrCodeUrl) {
          setQrCodeUrl(result.qrCodeUrl);
          setPaymentStatus("Scan QR code to complete payment");
          setQrPaid(false);
        } else {
          setPaymentStatus("Error: failed to generate QR code");
          setQrPaid(false);
        }
      } catch {
        setPaymentStatus("Failed to generate QR code");
        setQrPaid(false);
      }
    };

    useEffect(() => {
      if (paymentMethod === "qr_code") handleQRCodePayment();
      else {
        setQrCodeUrl(null);
        setQrPaid(false);
        setPaymentStatus("");
      }
    }, [paymentMethod, qrCodeType]);

    useEffect(() => {
      const cardValid =
        paymentMethod === "credit_card" &&
        Object.keys(errors).length === 0 &&
        watchedValues.number.length === 19 &&
        watchedValues.expiration.length === 5 &&
        watchedValues.security_code.length >= 3;
      const qrValid = paymentMethod === "qr_code" && qrPaid;
      onValidChange?.(paymentMethod === "credit_card" ? cardValid : qrValid);
    }, [errors, watchedValues, paymentMethod, qrPaid, onValidChange]);

    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex gap-4">
          {["credit_card", "qr_code"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => {
                setPaymentMethod(method as any);
                onPaymentMethodChange?.(method as "credit_card" | "qr_code");
              }}
              className={`px-3 py-1 border-b-2 transition text-f-24 ${
                paymentMethod === method
                  ? "border-gray-g63f text-white"
                  : "border-transparent text-gray-g3b0"
              }`}
            >
              {method === "credit_card" ? "Credit Card" : "QR Code"}
            </button>
          ))}
        </div>

        {paymentMethod === "credit_card" && (
          <div className="space-y-4">
            <div className="flex items-center gap-x-5">
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label="Card Number"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    maxLength={19}
                    inputMode="numeric"
                    errors={errors.number?.message}
                    onChange={(e) =>
                      field.onChange(formatCardNumber(e.target.value))
                    }
                  />
                )}
              />
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label="Card owner"
                    placeholder="John Doe"
                    errors={errors.name?.message}
                  />
                )}
              />
            </div>
            <div className="flex items-center gap-x-5">
              <Controller
                name="expiration"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label="Expiry date"
                    placeholder="MM/YY"
                    maxLength={5}
                    inputMode="numeric"
                    errors={errors.expiration?.message}
                    onChange={(e) =>
                      field.onChange(formatExpiration(e.target.value))
                    }
                  />
                )}
              />
              <Controller
                name="security_code"
                control={control}
                render={({ field }) => (
                  <InputTextFeild
                    {...field}
                    label="CVC"
                    placeholder="123"
                    maxLength={4}
                    inputMode="numeric"
                    errors={errors.security_code?.message}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                  />
                )}
              />
            </div>
            <div>
              data for test
              <div> card number : 4242-4242-4242-4242</div>
              <div> Card owner : John </div>
              <div> Expiry date : 10/27 </div>
              <div> cvc : 123 </div>
            </div>
          </div>
        )}

        {paymentMethod === "qr_code" && (
          <div className="space-y-4">
            {!qrCodeUrl ? (
              <button
                type="button"
                onClick={handleQRCodePayment}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                {loading
                  ? "Generating QR Code..."
                  : `Generate QR Code (${new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(amount)})`}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="rounded bg-gray-g63f p-10 flex flex-col items-center justify-center ">
                  <div className="text-gray-g3b0 text-fr-14 mb-5">
                    Time remaining :{" "}
                    <span className="text-blue-bbee">{countdown}</span>
                  </div>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="h-80 object-contain mb-5"
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
