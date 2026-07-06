export type GenLayerNetworkKey = "studionet" | "bradbury";

export type GenLayerNetworkConfig = {
  key: GenLayerNetworkKey;
  label: string;
  chainIdDecimal: number;
  chainIdHex: string;
  status: "development" | "testnet";
};

export const GENLAYER_NETWORKS: GenLayerNetworkConfig[] = [
  {
    key: "studionet",
    label: "GenLayer Studionet",
    chainIdDecimal: 61999,
    chainIdHex: "0xf22f",
    status: "development",
  },
  {
    key: "bradbury",
    label: "GenLayer Bradbury",
    chainIdDecimal: 4221,
    chainIdHex: "0x107d",
    status: "testnet",
  },
];

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

