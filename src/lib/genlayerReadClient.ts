import { createClient } from "genlayer-js";
import { studionet, testnetBradbury } from "genlayer-js/chains";
import {
  GENLAYER_CONTRACT_ADDRESS,
  GENLAYER_NETWORK_NAME,
} from "../config/integration";

const READ_METHOD_NAMES = [
  "get_contract_version",
  "get_latest_claim_verdict",
  "get_latest_task_verdict",
  "get_latest_dispute_verdict",
] as const;

export type VerdictLayerReadMethodName = (typeof READ_METHOD_NAMES)[number];

function getSelectedGenLayerChain() {
  if (GENLAYER_NETWORK_NAME === "bradbury" || GENLAYER_NETWORK_NAME === "testnetBradbury") {
    return testnetBradbury;
  }

  return studionet;
}

function getConfiguredContractAddress(): `0x${string}` {
  const contractAddress = GENLAYER_CONTRACT_ADDRESS.trim();

  if (contractAddress.length === 0) {
    throw new Error("Missing VITE_VERDICTLAYER_CONTRACT_ADDRESS.");
  }

  if (!/^0x[0-9a-fA-F]+$/.test(contractAddress)) {
    throw new Error("VITE_VERDICTLAYER_CONTRACT_ADDRESS must be a hex contract address.");
  }

  return contractAddress as `0x${string}`;
}

function isVerdictLayerReadMethodName(methodName: string): methodName is VerdictLayerReadMethodName {
  return READ_METHOD_NAMES.some((knownMethodName) => knownMethodName === methodName);
}

export function createVerdictLayerReadClient(): ReturnType<typeof createClient> {
  return createClient({
    chain: getSelectedGenLayerChain(),
  });
}

export async function readVerdictLayerString(methodName: string): Promise<string> {
  if (!isVerdictLayerReadMethodName(methodName)) {
    throw new Error(`Unsupported VerdictLayer read method: ${methodName}`);
  }

  const client = createVerdictLayerReadClient();
  const result: unknown = await client.readContract({
    address: getConfiguredContractAddress(),
    functionName: methodName,
    args: [],
  });

  if (typeof result !== "string") {
    throw new Error(`VerdictLayer read method ${methodName} returned a non-string result.`);
  }

  return result;
}

