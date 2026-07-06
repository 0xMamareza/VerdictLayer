import type {
  ClaimVerdictContractInput,
  ClaimVerdictContractResult,
  DisputeVerdictContractInput,
  DisputeVerdictContractResult,
  TaskVerdictContractInput,
  TaskVerdictContractResult,
} from "../types/contractSchemas";

export type VerdictLayerClient = {
  submitClaimVerdict(input: ClaimVerdictContractInput): Promise<ClaimVerdictContractResult>;
  submitTaskVerdict(input: TaskVerdictContractInput): Promise<TaskVerdictContractResult>;
  submitDisputeVerdict(input: DisputeVerdictContractInput): Promise<DisputeVerdictContractResult>;
};
