export const isBrowser = typeof window !== "undefined";
export const wsInstance = isBrowser
  ? new WebSocket(process.env.NEXT_PUBLIC_WSOURCE as string)
  : null;
export interface wsDets {
  exchange: string;
  pair: string;
  side: string;
  price: string;
  amount: string;
}
