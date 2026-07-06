import type {
  ClaimVerdictContractInput,
  ClaimVerdictContractResult,
  DisputeVerdictContractInput,
  DisputeVerdictContractResult,
  TaskVerdictContractInput,
  TaskVerdictContractResult,
} from "../types/contractSchemas";
import type { VerdictLayerClient } from "./verdictLayerClientTypes";

function throwNotImplemented(): never {
  throw new Error(
    "GenLayerJS integration is not implemented yet. Current mode should remain mock. Check INTEGRATION_CHECKLIST.md.",
  );
}

export const verdictLayerRealClient: VerdictLayerClient = {
  submitClaimVerdict(_input: ClaimVerdictContractInput): ClaimVerdictContractResult {
    return throwNotImplemented();
  },
  submitTaskVerdict(_input: TaskVerdictContractInput): TaskVerdictContractResult {
    return throwNotImplemented();
  },
  submitDisputeVerdict(_input: DisputeVerdictContractInput): DisputeVerdictContractResult {
    return throwNotImplemented();
  },
};
