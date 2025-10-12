import Ably from "ably";

if (!process.env.NEXT_PUBLIC_ABLY_API_KEY)
  throw new Error("ABLY_API_KEY missing");

export const ablyClient = new Ably.Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
});
