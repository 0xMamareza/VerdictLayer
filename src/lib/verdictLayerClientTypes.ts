import type {
  ClaimVerdictContractInput,
  ClaimVerdictContractResult,
  DisputeVerdictContractInput,
  DisputeVerdictContractResult,
  TaskVerdictContractInput,
  TaskVerdictContractResult,
} from "../types/contractSchemas";

export type VerdictLayerClient = {
  submitClaimVerdict(input: ClaimVerdictContractInput): ClaimVerdictContractResult;
  submitTaskVerdict(input: TaskVerdictContractInput): TaskVerdictContractResult;
  submitDisputeVerdict(input: DisputeVerdictContractInput): DisputeVerdictContractResult;
};
