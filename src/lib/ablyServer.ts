import Ably from "ably";

if (!process.env.ABLY_API_KEY) throw new Error("Missing ABLY_API_KEY");

export const ably = new Ably.Rest({
  key: process.env.ABLY_API_KEY,
});
