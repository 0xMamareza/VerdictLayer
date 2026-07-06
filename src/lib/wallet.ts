import type { EthereumProvider } from "../types/ethereum";

export type WalletConnectionState = {
  status: "not_detected" | "disconnected" | "connecting" | "connected" | "error";
  address: string | null;
  errorMessage: string | null;
  isMetaMask: boolean;
};

export type NetworkDetectionState = {
  status:
    | "not_detected"
    | "not_connected"
    | "checking"
    | "connected_supported"
    | "connected_unsupported"
    | "error";
  chainIdHex: string | null;
  chainIdDecimal: number | null;
  networkLabel: string | null;
  errorMessage: string | null;
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

export function parseHexChainIdToDecimal(chainIdHex: string): number | null {
  if (!/^0x[0-9a-f]+$/i.test(chainIdHex)) {
    return null;
  }

  const parsedChainId = Number.parseInt(chainIdHex, 16);

  return Number.isFinite(parsedChainId) ? parsedChainId : null;
}

export async function getWalletChainId(): Promise<string> {
  const provider = getInjectedEthereumProvider();

  if (!provider) {
    throw new Error("No injected wallet provider was detected.");
  }

  const response: unknown = await provider.request({ method: "eth_chainId" });

  if (typeof response !== "string" || response.trim().length === 0) {
    throw new Error("Wallet returned an unexpected chain id response.");
  }

  return response.toLowerCase();
}

