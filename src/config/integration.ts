export type IntegrationMode = "mock" | "genlayer";

function resolveIntegrationMode(envValue: string | undefined): IntegrationMode {
  return envValue === "genlayer" ? "genlayer" : "mock";
}

function resolveNetworkName(envValue: string | undefined): string {
  return envValue && envValue.trim().length > 0 ? envValue : "studionet";
}

export const INTEGRATION_MODE: IntegrationMode = resolveIntegrationMode(
  import.meta.env.VITE_VERDICTLAYER_INTEGRATION_MODE,
);

export const GENLAYER_CONTRACT_ADDRESS: string =
  import.meta.env.VITE_VERDICTLAYER_CONTRACT_ADDRESS ?? "";

export const GENLAYER_NETWORK_NAME: string = resolveNetworkName(
  import.meta.env.VITE_GENLAYER_NETWORK_NAME,
);

export function isGenLayerRuntimeConfigured(): boolean {
  return INTEGRATION_MODE === "genlayer" && GENLAYER_CONTRACT_ADDRESS.trim().length > 0;
}
