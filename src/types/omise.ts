export interface OmiseConfig {
  publicKey: string;
  secretKey: string;
  apiVersion?: string;
}

export interface CardToken {
  id: string;
  object: "token";
  livemode: boolean;
  location: string;
  used: boolean;
  card: {
    id: string;
    object: "card";
    brand: string;
    last_digits: string;
    expiration_month: number;
    expiration_year: number;
  };
}

export interface Charge {
  id: string;
  object: "charge";
  amount: number;
  currency: string;
  status: "pending" | "successful" | "failed" | "expired";
  paid: boolean;
  transaction?: string;
  source?: {
    id: string;
    type: string;
    scannable_code?: {
      type: string;
      image: {
        download_uri: string;
      };
    };
  };
}

export interface Source {
  id: string;
  object: string;
  type: string;
  flow: string;
  amount: number;
  currency: string;
  scannable_code?: {
    type: string;
    image: {
      download_uri: string;
    };
  };
}

export interface PaymentResult {
  success: boolean;
  chargeId?: string;
  sourceId?: string;
  qrCodeUrl?: string;
  error?: string;
  charge?: Charge;
}

export interface CreateChargeParams {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, string | number>;
  returnUri?: string;
}

export interface CreateSourceParams extends CreateChargeParams {
  type: "promptpay" | "truemoney" | "paynow";
}

export type PaymentMethod = "credit_card" | "qr_code";
export type QRCodeType = "promptpay" | "truemoney" | "paynow";
