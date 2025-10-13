import { OmiseConfig } from "@/types/omise";

export const omiseConfig: OmiseConfig = {
  publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "",
  secretKey: process.env.OMISE_SECRET_KEY || "",
  apiVersion: "2019-05-29",
};

export const OMISE_API_URL = "https://api.omise.co";
export const OMISE_VAULT_URL = "https://vault.omise.co";

export const validateOmiseConfig = (): boolean => {
  if (!omiseConfig.publicKey)
    throw new Error("NEXT_PUBLIC_OMISE_PUBLIC_KEY is not set");
  if (!omiseConfig.secretKey) throw new Error("OMISE_SECRET_KEY is not set");
  return true;
};
