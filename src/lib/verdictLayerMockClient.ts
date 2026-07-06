import type {
  ClaimVerdictContractInput,
  ClaimVerdictContractResult,
  DisputeVerdictContractInput,
  DisputeVerdictContractResult,
  TaskVerdictContractInput,
  TaskVerdictContractResult,
} from "../types/contractSchemas";
import { mockClaimJudge } from "../utils/mockClaimJudge";
import { mockDisputeResolver } from "../utils/mockDisputeResolver";
import { mockTaskJudge } from "../utils/mockTaskJudge";
import type { VerdictLayerClient } from "./verdictLayerClientTypes";

export function submitClaimVerdict(
  input: ClaimVerdictContractInput,
): ClaimVerdictContractResult {
  return mockClaimJudge({
    claim: input.claim,
    sourceUrls: [input.sourceUrl1, input.sourceUrl2, input.sourceUrl3],
    generatedAt: new Date().toISOString(),
  });
}

export function submitTaskVerdict(input: TaskVerdictContractInput): TaskVerdictContractResult {
  return mockTaskJudge({
    ...input,
    generatedAt: new Date().toISOString(),
  });
}

export function submitDisputeVerdict(
  input: DisputeVerdictContractInput,
): DisputeVerdictContractResult {
  return mockDisputeResolver({
    ...input,
    generatedAt: new Date().toISOString(),
  });
}

export const verdictLayerMockClient: VerdictLayerClient = {
  submitClaimVerdict,
  submitTaskVerdict,
  submitDisputeVerdict,
};
