const GUEST_TOKEN_KEY = "guest_token";

const createGuestToken = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

export const getGuestToken = () => {
  if (typeof window === "undefined") return null;

  const existingToken = localStorage.getItem(GUEST_TOKEN_KEY);
  if (existingToken) return existingToken;

  const token = createGuestToken();
  localStorage.setItem(GUEST_TOKEN_KEY, token);
  return token;
};

export const getExistingGuestToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_TOKEN_KEY);
};
