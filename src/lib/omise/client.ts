import {
  Charge,
  Source,
  CreateChargeParams,
  CreateSourceParams,
} from "@/types/omise";
import { omiseConfig, OMISE_API_URL } from "./config";

class OmiseClient {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private getAuthHeader(): string {
    if (!this.secretKey) throw new Error("Omise Secret Key is not configured");
    return `Basic ${Buffer.from(`${this.secretKey}:`).toString("base64")}`;
  }

  private async request<T, Body = unknown>(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: Body
  ): Promise<T> {
    const url = `${OMISE_API_URL}${endpoint}`;
    const headers: HeadersInit = {
      Authorization: this.getAuthHeader(),
      "Content-Type": "application/json",
      "Omise-Version": omiseConfig.apiVersion || "2019-05-29",
    };

    const options: RequestInit = { method, headers };
    if (body && method === "POST") options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const msg =
        (data as { message?: string; error?: string }).message ||
        (data as { message?: string; error?: string }).error ||
        "Omise API request failed";
      throw new Error(msg);
    }

    return data as T;
  }

  async createCharge(
    params: CreateChargeParams & { token: string }
  ): Promise<Charge> {
    return this.request<
      Charge,
      {
        amount: number;
        currency?: string;
        description?: string;
        metadata?: Record<string, unknown>;
        card: string;
      }
    >("/charges", "POST", {
      amount: params.amount,
      currency: params.currency || "THB",
      description: params.description,
      metadata: params.metadata,
      card: params.token,
    });
  }

  async createChargeWithSource(
    params: CreateChargeParams & { source: string }
  ): Promise<Charge> {
    return this.request<
      Charge,
      {
        amount: number;
        currency?: string;
        description?: string;
        metadata?: Record<string, unknown>;
        source: string;
        return_uri?: string;
      }
    >("/charges", "POST", {
      amount: params.amount,
      currency: params.currency || "THB",
      description: params.description,
      metadata: params.metadata,
      source: params.source,
      return_uri: params.returnUri,
    });
  }

  async createSource(params: CreateSourceParams): Promise<Source> {
    return this.request<
      Source,
      {
        type: string;
        amount?: number;
        currency?: string;
        description?: string;
        metadata?: Record<string, unknown>;
      }
    >("/sources", "POST", {
      type: params.type,
      amount: params.amount,
      currency: params.currency || "THB",
      description: params.description,
      metadata: params.metadata,
    });
  }

  async getCharge(chargeId: string): Promise<Charge> {
    return this.request<Charge>(`/charges/${chargeId}`);
  }

  async getSource(sourceId: string): Promise<Source> {
    return this.request<Source>(`/sources/${sourceId}`);
  }
}

export const omiseClient = new OmiseClient(omiseConfig.secretKey);
