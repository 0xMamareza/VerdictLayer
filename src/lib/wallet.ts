import type { EthereumProvider } from "../types/ethereum";

export type WalletConnectionState = {
  status: "not_detected" | "disconnected" | "connecting" | "connected" | "error";
  address: string | null;
  errorMessage: string | null;
  isMetaMask: boolean;
};

export function getInjectedEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.ethereum ?? null;
}

export function getShortAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function requestWalletAccounts(): Promise<string[]> {
  const provider = getInjectedEthereumProvider();

  if (!provider) {
    throw new Error("No injected wallet provider was detected.");
  }

  const response: unknown = await provider.request({ method: "eth_requestAccounts" });

  if (!Array.isArray(response) || !response.every((account) => typeof account === "string")) {
    throw new Error("Wallet returned an unexpected account response.");
  }

  return response;
}

