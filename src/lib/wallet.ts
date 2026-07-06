import type { EthereumProvider } from "../types/ethereum";
import type { GenLayerNetworkConfig } from "../config/genlayerNetworks";

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

function getProviderErrorCode(error: unknown): number | string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return null;
  }

  const code = error.code;

  if (typeof code === "number" || typeof code === "string") {
    return code;
  }

  return null;
}

function getProviderErrorMessage(error: unknown): string | null {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error !== "object" || error === null || !("message" in error)) {
    return null;
  }

  const message = error.message;

  return typeof message === "string" && message.trim().length > 0 ? message : null;
}

function isProviderErrorCode(error: unknown, expectedCode: number): boolean {
  const code = getProviderErrorCode(error);

  return code === expectedCode || code === String(expectedCode);
}

function getNetworkSwitchError(error: unknown): Error {
  if (isProviderErrorCode(error, 4001)) {
    return new Error("User rejected the network switch request.");
  }

  if (isProviderErrorCode(error, 4200) || isProviderErrorCode(error, -32601)) {
    return new Error("This wallet does not support network switching.");
  }

  const message = getProviderErrorMessage(error);

  return new Error(message ?? "Failed to switch or add the GenLayer network.");
}

export async function switchOrAddWalletNetwork(network: GenLayerNetworkConfig): Promise<void> {
  const provider = getInjectedEthereumProvider();

  if (!provider) {
    throw new Error("No injected wallet provider was detected.");
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.chainIdHex }],
    });
  } catch (switchError: unknown) {
    if (!isProviderErrorCode(switchError, 4902)) {
      throw getNetworkSwitchError(switchError);
    }

    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: network.chainIdHex,
            chainName: network.label,
            nativeCurrency: {
              name: network.nativeCurrencyName,
              symbol: network.nativeCurrencySymbol,
              decimals: network.nativeCurrencyDecimals,
            },
            rpcUrls: network.rpcUrls,
            blockExplorerUrls: network.blockExplorerUrls,
          },
        ],
      });
    } catch (addError: unknown) {
      throw getNetworkSwitchError(addError);
    }
  }
}
