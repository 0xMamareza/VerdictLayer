export type GenLayerNetworkKey = "studionet" | "bradbury";

export type GenLayerNetworkConfig = {
  key: GenLayerNetworkKey;
  label: string;
  chainIdDecimal: number;
  chainIdHex: string;
  status: "development" | "testnet";
  nativeCurrencyName: string;
  nativeCurrencySymbol: string;
  nativeCurrencyDecimals: number;
  rpcUrls: string[];
  blockExplorerUrls: string[];
};

export const DEFAULT_TARGET_GENLAYER_NETWORK_KEY: GenLayerNetworkKey = "studionet";

export const GENLAYER_NETWORKS: GenLayerNetworkConfig[] = [
  {
    key: "studionet",
    label: "GenLayer Studionet",
    chainIdDecimal: 61999,
    chainIdHex: "0xf22f",
    status: "development",
    nativeCurrencyName: "GEN",
    nativeCurrencySymbol: "GEN",
    nativeCurrencyDecimals: 18,
    rpcUrls: ["https://studio.genlayer.com/api"],
    blockExplorerUrls: [],
  },
  {
    key: "bradbury",
    label: "GenLayer Bradbury",
    chainIdDecimal: 4221,
    chainIdHex: "0x107d",
    status: "testnet",
    nativeCurrencyName: "GEN",
    nativeCurrencySymbol: "GEN",
    nativeCurrencyDecimals: 18,
    rpcUrls: ["https://rpc.testnet-chain.genlayer.com"],
    blockExplorerUrls: ["https://explorer.testnet-chain.genlayer.com"],
  },
];

export function getGenLayerNetworkByKey(key: GenLayerNetworkKey): GenLayerNetworkConfig {
  const network = GENLAYER_NETWORKS.find((candidate) => candidate.key === key);

  if (!network) {
    throw new Error(`Unknown GenLayer network key: ${key}`);
  }

  return network;
}

export function getKnownGenLayerNetworkByChainId(
  chainIdHex: string,
): GenLayerNetworkConfig | null {
  const normalizedChainId = chainIdHex.toLowerCase();

  return (
    GENLAYER_NETWORKS.find(
      (network) => network.chainIdHex.toLowerCase() === normalizedChainId,
    ) ?? null
  );
}
