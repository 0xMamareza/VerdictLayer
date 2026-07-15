export type IntegrationMode = "mock" | "genlayer";

function resolveIntegrationMode(envValue: string | undefined): IntegrationMode {
  return envValue === "genlayer" ? "genlayer" : "mock";
}

function resolveNetworkName(envValue: string | undefined): string {
  return envValue && envValue.trim().length > 0 ? envValue : "studionet";
}

function resolveDiagnosticsVisibility(envValue: string | undefined): boolean {
  return envValue === "true";
}

export const INTEGRATION_MODE: IntegrationMode = resolveIntegrationMode(
  import.meta.env.VITE_VERDICTLAYER_INTEGRATION_MODE,
);

export const GENLAYER_CONTRACT_ADDRESS: string =
  import.meta.env.VITE_VERDICTLAYER_CONTRACT_ADDRESS ?? "";

export const GENLAYER_NETWORK_NAME: string = resolveNetworkName(
  import.meta.env.VITE_GENLAYER_NETWORK_NAME,
);

export const SHOW_GENLAYER_DIAGNOSTICS: boolean = resolveDiagnosticsVisibility(
  import.meta.env.VITE_SHOW_GENLAYER_DIAGNOSTICS,
);

export function isGenLayerRuntimeConfigured(): boolean {
  return INTEGRATION_MODE === "genlayer" && GENLAYER_CONTRACT_ADDRESS.trim().length > 0;
}
