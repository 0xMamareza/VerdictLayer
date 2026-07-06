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
    "GenLayerJS integration is not implemented yet. Current runtime mode should remain mock. See INTEGRATION_CHECKLIST.md.",
  );
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
