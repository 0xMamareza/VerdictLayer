import { createClient } from "genlayer-js";
import { studionet, testnetBradbury } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

export type GenLayerSdkDiscoverySummary = {
  supportedNetworks: string[];
  hasCreateClientImport: boolean;
  hasTransactionStatusImport: boolean;
  note: string;
};

export function getGenLayerSdkDiscoverySummary(): GenLayerSdkDiscoverySummary {
  const availableNetworks: string[] = [];

  if (studionet.name.length > 0) {
    availableNetworks.push("studionet");
  }

  if (testnetBradbury.name.length > 0) {
    availableNetworks.push("testnetBradbury");
  }

  return {
    supportedNetworks: availableNetworks,
    hasCreateClientImport: typeof createClient === "function",
    hasTransactionStatusImport: typeof TransactionStatus === "object",
    note: "SDK discovery only. Not used by runtime.",
  };
}
