export const isClient = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

export const isServer = () =>
  typeof window === "undefined" || typeof document === "undefined";
