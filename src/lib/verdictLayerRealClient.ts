import type {
  ClaimVerdictContractInput,
  ClaimVerdictContractResult,
  DisputeVerdictContractInput,
  DisputeVerdictContractResult,
  TaskVerdictContractInput,
  TaskVerdictContractResult,
} from "../types/contractSchemas";
import type { VerdictLayerReadMethodName } from "./genlayerReadClient";
import type { VerdictLayerClient } from "./verdictLayerClientTypes";

function throwNotImplemented(): never {
  throw new Error(
    "GenLayer write transactions are not implemented yet. Current runtime mode should remain mock for submits. See INTEGRATION_CHECKLIST.md.",
  );
}

async function readVerdictLayerRaw(methodName: VerdictLayerReadMethodName): Promise<string> {
  const { readVerdictLayerString } = await import("./genlayerReadClient");

  return readVerdictLayerString(methodName);
}

export async function getContractVersion(): Promise<string> {
  return readVerdictLayerRaw("get_contract_version");
}

export async function getLatestClaimVerdictRaw(): Promise<string> {
  return readVerdictLayerRaw("get_latest_claim_verdict");
}

export async function getLatestTaskVerdictRaw(): Promise<string> {
  return readVerdictLayerRaw("get_latest_task_verdict");
}

export async function getLatestDisputeVerdictRaw(): Promise<string> {
  return readVerdictLayerRaw("get_latest_dispute_verdict");
}

export const verdictLayerRealClient: VerdictLayerClient = {
  async submitClaimVerdict(
    _input: ClaimVerdictContractInput,
  ): Promise<ClaimVerdictContractResult> {
    return throwNotImplemented();
  },
  async submitTaskVerdict(_input: TaskVerdictContractInput): Promise<TaskVerdictContractResult> {
    return throwNotImplemented();
  },
  async submitDisputeVerdict(
    _input: DisputeVerdictContractInput,
  ): Promise<DisputeVerdictContractResult> {
    return throwNotImplemented();
  },
};
