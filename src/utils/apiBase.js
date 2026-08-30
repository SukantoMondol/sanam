export const LIVE_BACKEND_URL = "https://kw.sanamstore.net";

export const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.BASE_URL ||
      "/api";

